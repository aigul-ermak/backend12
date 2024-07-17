import {Response} from "express";
import {UserService} from "../services/user-service";
import {RequestTypeWithQuery, RequestWithBody, RequestWithParams} from "../types/common";
import {CreateUserData} from "../types/user/input";
import {OutputUserItemType, OutputUsersType, SortUserType} from "../types/user/output";


export class UserController {
    constructor(protected userService: UserService) {
    }

    async createUser(req: RequestWithBody<CreateUserData>, res: Response<OutputUserItemType>) {
        //TODO type ??
        const newUser: any = await this.userService.createUser(req.body.login, req.body.password, req.body.email)
        if (newUser) {
            res.status(201).send(newUser)
        } else {
            res.sendStatus(401)
        }
    }

    async getAllUsers(req: RequestTypeWithQuery<SortUserType>, res: Response<OutputUsersType>) {
        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            searchLoginTerm: req.query.searchLoginTerm,
            searchEmailTerm: req.query.searchEmailTerm
        }

        const users: OutputUsersType = await this.userService.getAllUsers(sortData)

        res.status(200).send(users)
    }

    async deleteUser(req: RequestWithParams<{id: string}>, res: Response){
        const userId : string = req.params.id;
        const result = await this.userService.deleteUser(userId)

        if(!result) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}
