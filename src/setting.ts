import express from "express";
import bodyParser from "body-parser";
import deleteDataRouter from "./routes/testingRouter";
import blogsRouter from "./routes/blogsRouter";
import postsRouter from "./routes/postsRouter";
import usersRouter from "./routes/usersRouter";

const app = express();

app.use(bodyParser.json());
app.get('/', (req, res) => {res.send('main page')});
app.use('/testing/all-data', deleteDataRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

export default app;