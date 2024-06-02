import app from "./setting";
import {runDb} from "./repositories/dbConfig";
import "dotenv/config";

const port: string = process.env.PORT!;

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`app listening on port ${port}`);
    });
};
startApp();
