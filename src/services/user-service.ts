import {OutputUserItemType, OutputUsersType, SortUserType, UserDBType} from "../types/user/output";
import bcrypt from 'bcrypt';
import {QueryUserRepo} from "../repositories/user-repo/query-user-repo";
import {UserRepo} from "../repositories/user-repo/user-repo";
import {add} from "date-fns/add";
import {uuid} from "uuidv4";
import {emailManager} from "./email-manager";
import {UserModel} from "../models/user";
import {userMapper} from "../types/user/mapper";
import {BlogModel} from "../models/blog";
import {ObjectId} from "mongodb";

export class UserService {
    constructor(protected userRepo: UserRepo) {}
    async createUser(login: string, password: string, email: string) {

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser: UserDBType = {
            accountData: {
                login,
                email,
                passwordHash,
                passwordRecoveryCode: "",
                recoveryCodeExpirationDate: null,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: "",
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        const userId: string = await this.userRepo.createUser(newUser)
        const user: OutputUserItemType | null = await QueryUserRepo.findUserById(userId)

        if (!user) {
            return null
        }
        return {
            id: user.id,
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        };
    }

    async getAllUsers(sortData: SortUserType) {

        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null

        type FilterType = {
            $or?: ({
                $regex: string;
                $options: string;
            } | {})[];
        };
        let filter: FilterType = {$or: []};
        if (searchEmailTerm) {
            filter['$or']?.push({email: {$regex: searchEmailTerm, $options: 'i'}});
        }
        if (searchLoginTerm) {
            filter['$or']?.push({login: {$regex: searchLoginTerm, $options: 'i'}});
        }
        if (filter['$or']?.length === 0) {
            filter['$or']?.push({});
        }

        //const users: WithId<UserType>[] = await UserModel
        //TODO any here
        const users: any[] = await UserModel
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        //.toArray()

        const totalCount: number = await UserModel.countDocuments(filter);

        const pageCount: number = Math.ceil(totalCount / +pageSize);
        console.log(users)
        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: users.map(userMapper)
        }
    }

    async deleteBlog(id: string): Promise<boolean> {
        const res = await BlogModel.deleteOne({_id: new ObjectId(id)});

        return !!res.deletedCount;
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user: OutputUserItemType | null = await QueryUserRepo.findByLoginOrEmail(loginOrEmail)

        if (!user || !user.accountData.passwordHash) {
            return null
        }

        const isPasswordMatch = await bcrypt.compare(password, user.accountData.passwordHash);
        if (isPasswordMatch)
            return user
        else
            return null
    }

    //TODO check type user
    async findUserById(userId: any) {
        const user: OutputUserItemType | null = await QueryUserRepo.findUserById(userId)

        if (!user) {
            return null
        }

        return user;
    }

    async deleteUser(userId: string) {

        const userExists: OutputUserItemType | null = await QueryUserRepo.findUserById(userId)

        if (!userExists) {
            return null;
        }

        await this.userRepo.deleteUser(userId)
        return true

    }

    async passwordRecovery(email: string): Promise<boolean> {

        const user = await QueryUserRepo.findUserByEmail(email);

        if (user) {
            const passwordRecoveryCode: string = uuid();

            await this.userRepo.updateUser(user.id, passwordRecoveryCode);
            await emailManager.sendRecoveryCodeMessage(user.accountData.email, passwordRecoveryCode);
            return true;
        }

        return false;

    }

//TODO type??
    async newPassword(newPassword: string, recoveryCode: string) {
        //TODO type??
        const user: any = await QueryUserRepo.findUserByRecoveryCode(recoveryCode);

        if (user) {
            {
                const hashedPassword: string = await bcrypt.hash(newPassword, 10);
                await QueryUserRepo.updatePassword(user.id, hashedPassword);
                return true;
            }
        }
        return false;
    }
}

// export const userService = new UserService()