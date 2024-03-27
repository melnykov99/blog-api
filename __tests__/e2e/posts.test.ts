import request from 'supertest'
import app from '../../src/setting';
/*

const blogsPath = '/blogs'
const postsPath = '/posts'
const testingPath = '/testing/all-data';
const authHeader = 'Basic ' + Buffer.from('admin:qwerty').toString('base64');

describe('posts tests', () => {
    beforeAll(async () => {
        await request(app)
            .delete(testingPath)
            .expect(204)
    })
    afterAll(async () => {
        await request(app)
            .delete(testingPath)
            .expect(204)
    })
    describe('GET /posts', () => {
        it('should return 200 and empty array', async () => {
            // При запуске приложения массив пуст
            await request(app)
                .get(postsPath)
                .expect(200, [])
        });
        it('should return 200 and all available blogs', async () => {
            // Создаем блог чтобы создать пост
            let validBlogId: string;
            // Создаем блог перед тестами и сохраняем его id
            const newBlogResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({
                    name: 'Test Blog',
                    description: 'This is a test blog',
                    websiteUrl: 'https://testblog.com'
                })
                .expect(201);
            validBlogId = newBlogResponse.body.id;

            const post1 = {
                title: 'Test title',
                shortDescription: 'shortDescription test',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                blogId: validBlogId
            };
            const post2 = {
                title: 'Test title',
                shortDescription: 'shortDescription test',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                blogId: validBlogId
            };

            // Создаем посты
            await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send(post1)
                .expect(201);

            await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send(post2)
                .expect(201);

            // Получаем все посты
            const response = await request(app)
                .get(postsPath)
                .expect(200);

            // Проверяем, что полученный массив содержит созданные посты
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(post1),
                    expect.objectContaining(post1)
                ])
            );
        })
    })
    describe('POST /posts', () => {
        // Проверка ошибок авторизации
        it('should return status 401 if not authorized', async () => {
            // Отправляем POST запрос без авторизационного заголовка
            const response = await request(app)
                .post('/posts')
                .send({
                    title: 'Test Post',
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: 'blogId123',
                })
                .expect(401);
        });
        it('should return status 401 if unauthorized', async () => {
            // Отправляем POST запрос с неверным авторизационным заголовком
            const response = await request(app)
                .post('/posts')
                .set('Authorization', 'Basic invalidToken')
                .send({
                    title: 'Test Post',
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: 'blogId123',
                })
                .expect(401);
        });
        // Проверка ошибок валидации
        it('should return 400 status if required fields are missing', async () => {
            // Отправляем запрос на создание поста без обязательных полей
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({})
                .expect(400);

            // Проверяем, что в ответе есть сообщение об ошибке о недостающих полях
            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "title",
                        message: "title must be string with maximum length 30 characters"
                    },
                    {
                        field: "shortDescription",
                        message: "shortDescription must be string with maximum length 100 characters"
                    },
                    {
                        field: "content",
                        message: "content must be string with maximum length 1000 characters"
                    },
                    {
                        field: "blogId",
                        message: "blogId must be string with existing blog id"
                    }
                ]
            });
        });
        let validBlogId: string;
        beforeAll(async () => {
            // Создаем блог перед тестами и сохраняем его id
            const newBlogResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({
                    name: 'Test Blog',
                    description: 'This is a test blog',
                    websiteUrl: 'https://testblog.com'
                })
                .expect(201);

            validBlogId = newBlogResponse.body.id;
        });
        it('should return 400 status if title field is missing', async () => {
            // Отправляем запрос на создание поста без поля title
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "title",
                        message: "title must be string with maximum length 30 characters"
                    }
                ]
            });
        });
        it('should return 400 status if title field is empty', async () => {
            // Отправляем запрос на создание поста с пустым полем title
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: '',
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "title",
                        message: "title must be string with maximum length 30 characters"
                    }
                ]
            });
        });
        it('should return 400 status if title field exceeds maximum length', async () => {
            // Создаем строку с более чем 30 символами
            const longString = 'a'.repeat(31);
            // Отправляем запрос на создание поста
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: longString,
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "title",
                        message: "title must be string with maximum length 30 characters"
                    }
                ]
            });
        });
        it('should return 400 status if title field is not a string', async () => {
            // Отправляем запрос на создание поста, где title не строка
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 123,
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "title",
                        message: "title must be string with maximum length 30 characters"
                    }
                ]
            });
        });
        it('should return 400 status if shortDescription field is missing', async () => {
            // Отправляем запрос на создание поста без поля shortDescription
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "shortDescription",
                        message: 'shortDescription must be string with maximum length 100 characters',
                    }
                ]
            });
        });
        it('should return 400 status if shortDescription field is empty', async () => {
            // Отправляем запрос на создание поста с пустым полем shortDescription
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: '',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "shortDescription",
                        message: 'shortDescription must be string with maximum length 100 characters',
                    }
                ]
            });
        });
        it('should return 400 status if shortDescription field exceeds maximum length', async () => {
            // Создаем строку с более чем 100 символами
            const longString = 'a'.repeat(101);
            // Отправляем запрос на создание поста
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: longString,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "shortDescription",
                        message: 'shortDescription must be string with maximum length 100 characters',
                    }
                ]
            });
        });
        it('should return 400 status if shortDescription field is not a string', async () => {
            // Отправляем запрос на создание поста, где shortDescription не строка
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 123,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "shortDescription",
                        message: 'shortDescription must be string with maximum length 100 characters',
                    }
                ]
            });
        });
        it('should return 400 status if content field is missing', async () => {
            // Отправляем запрос на создание поста без поля content
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'test shortDescription',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "content",
                        message: 'content must be string with maximum length 1000 characters',
                    }
                ]
            });
        });
        it('should return 400 status if content field is empty', async () => {
            // Отправляем запрос на создание поста с пустым полем content
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: '',
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "content",
                        message: 'content must be string with maximum length 1000 characters',
                    }
                ]
            });
        });
        it('should return 400 status if content field exceeds maximum length', async () => {
            // Создаем строку с более чем 1000 символами
            const longString = 'a'.repeat(1001);
            // Отправляем запрос на создание поста
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: longString,
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "content",
                        message: 'content must be string with maximum length 1000 characters',
                    }
                ]
            });
        });
        it('should return 400 status if content field is not a string', async () => {
            // Отправляем запрос на создание поста, где content не строка
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: 123,
                    blogId: validBlogId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "content",
                        message: 'content must be string with maximum length 1000 characters',
                    }
                ]
            });
        });
        it('should return 400 status if blogId field is missing', async () => {
            // Отправляем запрос на создание поста без поля blogId
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'test shortDescription',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "blogId",
                        message: 'blogId must be string with existing blog id',
                    }
                ]
            });
        });
        it('should return 400 status if blogId field is empty', async () => {
            // Отправляем запрос на создание поста с пустым полем blogId
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: ''
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "blogId",
                        message: 'blogId must be string with existing blog id',
                    }
                ]
            });
        });
        it('should return 400 status if blogId field is not a string', async () => {
            // Отправляем запрос на создание поста, где blogId не строка
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: 123
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "blogId",
                        message: 'blogId must be string with existing blog id',
                    }
                ]
            });
        });
        it('should return 400 status if a blog with this blogId does not exist', async () => {
            // Генерируем случайный id, который не существует в системе
            const nonExistentId = 'nonExistentId123';
            // Отправляем запрос на создание поста с несуществующим blogId
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: nonExistentId
                })
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "blogId",
                        message: 'blogId must be string with existing blog id',
                    }
                ]
            });
        });
        //Проверка создания поста с валидными данными
        it('should create a new post and return 201 status', async () => {
            // Отправляем запрос на создание поста с валидными данными
            const newPost = {
                title: 'Test title',
                shortDescription: 'shortDescription test',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                blogId: validBlogId
            }
            const response = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send(newPost)
                .expect(201);

            const createdPost = response.body;
            expect(createdPost).toEqual(expect.objectContaining({
                id: expect.any(String),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
            }));
            const {id} = createdPost;
            // Отправляем GET запрос для получения созданного поста по его id
            const getResponse = await request(app)
                .get(`${postsPath}/${id}`)
                .set('Authorization', authHeader)
                .expect(200);
            // Проверяем, что данные о полученном посте совпадают с отправленными при создании
            const retrievedBlog = getResponse.body;
            expect(retrievedBlog).toEqual(createdPost);
        });
    });
    describe('GET /posts/:id', () => {
        it('should return 200 and the specified post', async () => {
            // Создаем блог для создания поста
            const newBlogResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({
                    name: 'Test Blog',
                    description: 'This is a test blog',
                    websiteUrl: 'https://testblog.com'
                })
                .expect(201);
            const validBlogId = newBlogResponse.body.id;

            // Создаем пост
            const newPostResponse = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(201);
            const postId = newPostResponse.body.id;

            // Получаем созданный пост
            const response = await request(app)
                .get(`/posts/${postId}`)
                .expect(200);

            // Проверяем, что получен правильный пост
            expect(response.body).toEqual(expect.objectContaining({
                id: postId,
                title: 'Test title',
                shortDescription: 'shortDescription test',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                blogId: validBlogId
            }));
        });
        it('should return 404 if post is not found', async () => {
            const nonExistentPostId = 'nonExistentId123';

            await request(app)
                .get(`${postsPath}/${nonExistentPostId}`)
                .expect(404);
        });
    });
    describe('PUT /posts/:id', () => {
        let validBlogId: string;
        let validBlogId2: string;
        let validPostId: string;
        beforeAll(async () => {
            // Создаем блог перед тестами и сохраняем его id
            const newBlogResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({
                    name: 'Test Blog',
                    description: 'This is a test blog',
                    websiteUrl: 'https://testblog.com'
                })
                .expect(201);
            validBlogId = newBlogResponse.body.id;
            // Создаем второй блог, чтобы обновить blogId в дальнейшем
            const newBlogResponse2 = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({
                    name: 'Test Blog',
                    description: 'This is a test blog',
                    websiteUrl: 'https://testblog.com'
                })
                .expect(201);
            validBlogId2 = newBlogResponse2.body.id;
            // Создаем пост
            const newPostResponse = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'This is a test post',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(201)
            validPostId = newPostResponse.body.id;
        });
        it('should return 204 if post is successfully updated', async () => {
            // Отправляем PUT запрос для обновления созданного поста
            await request(app)
                .put(`${postsPath}/${validPostId}`)
                .set('Authorization', authHeader)
                .send({
                    title: 'Updated title',
                    shortDescription: 'Updated shortDescription',
                    content: 'Updated content',
                    blogId: validBlogId2
                })
                .expect(204);
        });
        it('should return 400 if request is invalid', async () => {
            // Отправляем PUT запрос с несуществующим blogId
            // Остальные проверки валидации выполнены в POST
            const nonExistentId = 'nonExistentId123';
            const response = await request(app)
                .put(`${postsPath}/${validPostId}`)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'Updated shortDescription',
                    content: 'Updated content',
                    blogId: nonExistentId
                })
                .expect(400);
            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "blogId",
                        message: "blogId must be string with existing blog id"
                    }
                ]
            });
        });
        it('should return 404 if post to update is not found', async () => {
            const nonExistentPostId = 'nonExistentId123';

            // Отправляем PUT запрос для обновления несуществующего поста
            await request(app)
                .put(`${postsPath}/${nonExistentPostId}`)
                .set('Authorization', authHeader)
                .send({
                    title: 'Updated title',
                    shortDescription: 'Updated shortDescription',
                    content: 'Updated content',
                    blogId: validBlogId
                })
                .expect(404);
        });
        it('should return 401 if request is unauthorized', async () => {
            // Отправляем PUT запрос без авторизации
            await request(app)
                .put(`${postsPath}/${validPostId}`)
                .send({
                    title: 'Updated title',
                    shortDescription: 'Updated shortDescription',
                    content: 'Updated content',
                    blogId: validBlogId
                })
                .expect(401);
        });
    });
    describe('DELETE /posts/:id', () => {
        it('should return 204 if post is successfully deleted', async () => {
            // Создаем блог для создания поста
            const newBlogResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({
                    name: 'Test Blog',
                    description: 'This is a test blog',
                    websiteUrl: 'https://test.com'
                })
                .expect(201);
            const validBlogId = newBlogResponse.body.id;

            // Создаем пост для удаления
            const newPostResponse = await request(app)
                .post(postsPath)
                .set('Authorization', authHeader)
                .send({
                    title: 'Test title',
                    shortDescription: 'shortDescription test',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    blogId: validBlogId
                })
                .expect(201);

            const postIdToDelete = newPostResponse.body.id;

            // Отправляем DELETE запрос для удаления созданного поста
            await request(app)
                .delete(`${postsPath}/${postIdToDelete}`)
                .set('Authorization', authHeader)
                .expect(204);
        });

        it('should return 404 if post to delete is not found', async () => {
            const nonExistentPostId = 'nonExistentId123';

            // Отправляем DELETE запрос для удаления несуществующего поста
            await request(app)
                .delete(`${postsPath}/${nonExistentPostId}`)
                .set('Authorization', authHeader)
                .expect(404);
        });
    });
});

 */
