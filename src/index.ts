import app from "./setting";
import {runDb} from "./repositories/dbConfig";
import 'dotenv/config';

const port: string | undefined | number = process.env.PORT || 3000;

runDb().then(() => {
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
})
