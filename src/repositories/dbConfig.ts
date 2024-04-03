import {Collection, MongoClient} from "mongodb";
import 'dotenv/config';
import {Blog} from "../libs/types/blogsTypes";
import {Post} from "../libs/types/postsTypes";
import {User} from "../libs/types/usersTypes";
import {CommentDb} from "../libs/types/commentsTypes";

const mongoUri = process.env.MONGOURI!;

const client = new MongoClient(mongoUri);
const db = client.db('blog-api');
const blogsCollection: Collection<Blog> = db.collection<Blog>('blogs');
const postsCollection: Collection<Post> = db.collection<Post>('posts');
const usersCollection: Collection<User> = db.collection<User>('users');
const commentsCollection: Collection<CommentDb> = db.collection<CommentDb>('comments');
async function runDb() {
    try {
        await client.connect();
        console.log('Connected successfully to mongo server');
    } catch (error) {
        console.log(error);
        await client.close();
    }
}
export {runDb, blogsCollection, postsCollection, usersCollection, commentsCollection}