import app from "./setting";
import {runDb} from "./repositories/db";

const port = process.env.PORT!;

app.listen(port, async () => {
    await runDb()
    console.log(`app listening on port ${port}`);
})