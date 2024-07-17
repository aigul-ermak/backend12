import {emailAdapter} from "./email-adapter";
import {emailManager} from "./email-manager";

export const businessService = {
    async doOperation() {
        //save to repo
        //get user from repo
        //await emailAdapter.sendEmail("user.email", "password recovery", "<div>message</div>")
        // await emailManager.sendPasswordRecoveryMessage({})
    }
}



//     <h1>Thank for your registration</h1>
// <p>To finish registration please follow the link below:
//     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
// </p>