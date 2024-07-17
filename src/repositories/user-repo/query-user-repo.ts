import {OutputUserItemType, OutputUsersType, SortUserType, UserDBType} from "../../types/user/output";
import {ObjectId, WithId} from "mongodb";
import {userMapper, userMapper1} from "../../types/user/mapper";
import {UserModel} from "../../models/user";
import {QuerySecurityRepo} from "../security-repo/query-security-repo";
import bcrypt from "bcrypt";
import {SessionModel} from "../../models/security";


export class QueryUserRepo {
    static async getAllUsers(sortData: SortUserType): Promise<OutputUsersType> {

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

        // const filter: FilterQuery<User> = {
        //     $or: [
        //         { 'accountData.email': { $regex: formattedSortData.searchEmailTerm ?? '', $options: 'i' } },
        //         { 'accountData.login': { $regex: formattedSortData.searchLoginTerm ?? '', $options: 'i' } },
        //     ],
        // };


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

    static async findUserById(id: string): Promise<OutputUserItemType | null> {
        const user: WithId<UserDBType> | null = await UserModel.findOne({_id: new ObjectId(id)})

        if (!user) {
            return null
        }

        return userMapper(user)
    }

    static async findUserByEmail(email: string): Promise<OutputUserItemType | null> {
        const user: WithId<UserDBType> | null = await UserModel.findOne({ 'accountData.email': email });

        if (!user) {
            return null;
        }

        return userMapper(user);
    }

    static async findByLoginOrEmail(loginOrEmail: string): Promise<OutputUserItemType | null> {
        const user: WithId<UserDBType> | null = await UserModel.findOne({
            $or:
                [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]
        })

        if (!user) {
            return null
        }
        return userMapper(user)
    }

    static async findUserByConfirmationCode(code: string): Promise<OutputUserItemType | null> {
        const user: WithId<UserDBType> | null = await UserModel.findOne({"emailConfirmation.confirmationCode": code})
        if (!user) {
            return null
        }
        return userMapper(user)
    }

    static async checkUserExistByEmail(email: string) {

        const user: UserDBType | null = await SessionModel.findOne({'accountData.email': email});
        return user !== null;
    }

    static async findUserByRecoveryCode(recoveryCode: string): Promise<UserDBType | null> {
        const user: any = await UserModel.findOne({"accountData.passwordRecoveryCode": recoveryCode});
        return user ? userMapper(user) : null;
    }

    // static async findUserByRecoveryCode(recoveryCode: string): Promise<UserDBType | null> {
    //     return await SessionModel.findOne({'emailConfirmation.confirmationCode': recoveryCode});
    // }

//TODO type??
    static async updatePassword(userId: string, passwordHash: string): Promise<any> {
        return UserModel.updateOne({ _id: userId }, { $set: { 'accountData.passwordHash': passwordHash } });
    }
}