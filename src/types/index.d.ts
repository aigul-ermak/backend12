//index.d.ts
import {OutputUserItemType} from "./user/output";

declare global {
    declare  namespace Express {
        export interface Request {
            user: OutputUserItemType | null
            //userId: string | null
            //user: ViewUserModel | null
        }
    }
}