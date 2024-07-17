import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../services/jwt-sevice";
import {ObjectId} from "mongodb";
import {UserService} from "../../services/user-service";
import {OutputUserItemType} from "../../types/user/output";
import {userService} from "../../composition-root";


export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId: ObjectId | null = await jwtService.getUserIdByToken(token)

    if (!userId) {
        res.sendStatus(401)
        return
    }

    const user: OutputUserItemType | null = await userService.findUserById(userId)

    if (!user) {
        res.sendStatus(401)
        return
    }

    req.user = user
    next()
}
