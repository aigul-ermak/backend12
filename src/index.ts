import {configApp} from "./config/settings";
import {runDb} from "./config/db";
import {app} from "./app";

const port = 3000;




const startApp = async (): Promise<void> => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();

