import {Router, Response} from "express";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {userValidation} from "../validators/user-validator";
import {userController} from "../composition-root";

export const userRouter: Router = Router({})

userRouter.post('/', authMiddleware, userValidation(), userController.createUser.bind(userController));

userRouter.get('/', userController.getAllUsers.bind(userController));

userRouter.delete('/:id', authMiddleware,  userController.deleteUser.bind(userController));
