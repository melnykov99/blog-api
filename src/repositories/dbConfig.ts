import {Collection, MongoClient} from "mongodb";
import 'dotenv/config';
import {Blog} from "../libs/types/blogsTypes";
import {Post} from "../libs/types/postsTypes";
import {User} from "../libs/types/usersTypes";
import {CommentDb} from "../libs/types/commentsTypes";
import {InvalidRefreshTokenDB} from "../libs/types/authTypes";
import {DeviceDB} from "../libs/types/devicesTypes";

const mongoUri = process.env.MONGOURI!;

const client = new MongoClient(mongoUri);
const db = client.db('blog-api');
const blogsCollection: Collection<Blog> = db.collection<Blog>('blogs');
const postsCollection: Collection<Post> = db.collection<Post>('posts');
const usersCollection: Collection<User> = db.collection<User>('users');
const commentsCollection: Collection<CommentDb> = db.collection<CommentDb>('comments');
//TODO: нужна какая-то крона, которая будет проходится по этой коллекции и удалять истекшие токены, их уже нет смысла хранить в БД. При попытке их использовать будет ошибка потому что они истекли.
const invalidRefreshTokensCollection: Collection<InvalidRefreshTokenDB> = db.collection<InvalidRefreshTokenDB>('invalidRefreshTokens');
const devicesCollection: Collection<DeviceDB> = db.collection<DeviceDB>('devices');
async function runDb() {
    try {
        await client.connect();
        console.log('Connected successfully to mongo server');
    } catch (error) {
        console.log(error);
        await client.close();
    }
}
export {runDb, blogsCollection, postsCollection, usersCollection, commentsCollection, invalidRefreshTokensCollection, devicesCollection}