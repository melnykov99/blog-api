import {Collection, MongoClient} from "mongodb";
import "dotenv/config";
import {Blog} from "../libs/types/blogsTypes";
import {Post} from "../libs/types/postsTypes";
import {User} from "../libs/types/usersTypes";
import {CommentDb} from "../libs/types/commentsTypes";
import {DeviceDB} from "../libs/types/devicesTypes";
import {TokenBlackList} from "../libs/types/tokenBlackListTypes";

const mongoUri = process.env.MONGOURI!;

const client = new MongoClient(mongoUri);
const db = client.db("blog-api");
const blogsCollection: Collection<Blog> = db.collection<Blog>("blogs");
const postsCollection: Collection<Post> = db.collection<Post>("posts");
const usersCollection: Collection<User> = db.collection<User>("users");
const commentsCollection: Collection<CommentDb> = db.collection<CommentDb>("comments");
// Предполагается, что тут будет какая-то крона, которая будет проходится по этой коллекции и удалять девайсы с истекшими токенами, их уже нет смысла хранить в БД.
const devicesCollection: Collection<DeviceDB> = db.collection<DeviceDB>("devices");
// И тут крона, которая будет удалять протухшие токены
const tokensBlacklistCollection: Collection<TokenBlackList> = db.collection<TokenBlackList>("tokensBlackList");
async function runDb() {
    try {
        await client.connect();
        console.log("Connected successfully to mongo server");
    } catch (error) {
        console.log(error);
        await client.close();
    }
}
export {runDb, blogsCollection, postsCollection, usersCollection, commentsCollection, devicesCollection, tokensBlacklistCollection};