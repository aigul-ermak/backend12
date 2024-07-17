import {emailAdapter} from "./email-adapter";
import {OutputUserItemType, UserDBType} from "../types/user/output";
import {v4 as uuid4} from "uuid";

export const emailManager = {

    async sendEmailConfirmationMessage(user: UserDBType) {
        const code: string = user.emailConfirmation.confirmationCode

        const message: string = `
    <h1>Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href="https://somesite.com/confirm-email?code=${code}">complete registration</a>
    </p>`;
        await emailAdapter.sendEmail(user.accountData.email, "Email Confirmation", message)
    },

    //TODO check !user case
    sendEmailMessage: async function (user: OutputUserItemType | null) {

        if(!user) {
            return
        }

        const code: string = user.emailConfirmation.confirmationCode

        const message: string = `
    <h1>Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href="https://somesite.com/confirm-email?code=${code}">complete registration</a>
    </p>`;

        await emailAdapter.sendEmail(user.accountData.email, "Email Confirmation", message);
    },


    sendRecoveryCodeMessage: async function (email: string, recoveryCode: string): Promise<void> {
        const message: string = `
            <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
                <a href='https://somesite.com/password-recovery?recoveryCode=${encodeURIComponent(recoveryCode)}'>Recover Password</a>
            </p>`;
        await emailAdapter.sendEmail(email, "Password Recovery", message)
    }
}