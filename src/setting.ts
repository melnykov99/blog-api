import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import deleteDataRouter from "./routes/testingRouter";
import blogsRouter from "./routes/blogsRouter";
import postsRouter from "./routes/postsRouter";
import usersRouter from "./routes/usersRouter";
import authRouter from "./routes/authRouter";
import commentsRouter from "./routes/commentsRouter";
import cookieParser from "cookie-parser";
import devicesRouter from "./routes/devicesRouter";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
    res.send("main page");
});
app.use("/testing/all-data", deleteDataRouter);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/comments", commentsRouter);
app.use("/security/devices", devicesRouter);

export default app;