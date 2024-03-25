import app from "./setting";
import {runDb} from "./repositories/db";
import 'dotenv/config';

const port = process.env.PORT!;

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
}
startApp()

export default startApp;