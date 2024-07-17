import {Router, Request, Response} from "express";
import {userAuthValidation} from "../validators/login-validator";
import {authBearerMiddleware} from "../middleware/auth/auth-bearer-middleware";
import {
    newPasswordValidation,
    recoveryCodeValidation,
    userCodeValidation,
    userEmailValidation, userRecPassEmailValidation,
    userValidation
} from "../validators/user-validator";
import {cookieMiddleware, countMiddleware, sessionRefreshTokeMiddleware} from "../middleware/auth/cookie_middleware";
import {authController} from "../composition-root";

export const authRouter: Router = Router({})

authRouter.post('/registration', countMiddleware, userValidation(), authController.createUser.bind(authController));

authRouter.post('/login', countMiddleware, userAuthValidation(), authController.loginUser.bind(authController));

authRouter.post('/password-recovery', countMiddleware, userRecPassEmailValidation(), authController.passwordRecovery.bind(authController));

authRouter.post('/new-password', countMiddleware, newPasswordValidation(), recoveryCodeValidation(), authController.newPassword.bind(authController))

authRouter.post('/refresh-token', sessionRefreshTokeMiddleware, cookieMiddleware, authController.refreshTokens.bind(authController));

authRouter.post('/registration-confirmation', countMiddleware, userCodeValidation(), authController.confirmEmail.bind(authController));

authRouter.post('/registration-email-resending', countMiddleware, userEmailValidation(), authController.sendNewCodeToEmail.bind(authController));

authRouter.get('/me', authBearerMiddleware, authController.findUserById.bind(authController));

authRouter.post('/logout', sessionRefreshTokeMiddleware, authController.logoutUser.bind(authController));

