import app from "./setting";
import {runDb} from "./repositories/dbConfig";
import "dotenv/config";

const port: string = process.env.PORT || "3000";

const startApp = async(): Promise<void> => {
    await runDb();
    app.listen(port, () => {
        console.log(`app listening on port ${port}`);
    });
};
startApp();
