import express from "express";
import bodyParser from "body-parser";
import {videosRouter} from "./routes/videosRoutes";
import {deleteDataRouter} from "./routes/testingRouter";

const app = express();
const port = 3000;

app.use(bodyParser());
app.get('/', (req, res) => {res.send('main page')});
app.use('/testing/all-data', deleteDataRouter)
app.use('/videos', videosRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})