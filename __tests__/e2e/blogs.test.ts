import request from 'supertest'
import app from '../../src/setting';

const blogsPath = '/blogs';
const testingPath = '/testing/all-data';
const authHeader = 'Basic ' + Buffer.from('admin:qwerty').toString('base64');
async function deleteAllData() {
    await request(app)
        .delete(testingPath)
        .expect(204)
}
describe('blogs tests', () => {
    describe('GET /blogs', () => {
        beforeEach(deleteAllData)
        afterEach(deleteAllData)
        it('should return 200 and empty array', async () => {
            console.log(app)
            // При запуске приложения массив пуст
            await request(app)
                .get(blogsPath)
                .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        });
        it('should return 200 and all available blogs', async () => {
            // Предварительно создаем несколько блогов в системе
            const blog1 = {
                name: 'Blog 1',
                description: 'Description for Blog 1',
                websiteUrl: 'http://blog1.com'
            };
            const blog2 = {
                name: 'Blog 2',
                description: 'Description for Blog 2',
                websiteUrl: 'http://blog2.com'
            };

            // Создаем блоги
            await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader) // Добавляем заголовок авторизации
                .send(blog1)
                .expect(201);

            await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send(blog2)
                .expect(201);

            // Получаем все блоги
            const response = await request(app)
                .get(blogsPath)
                .expect(200);

            // Проверяем, что полученный массив содержит созданные блоги
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(blog1),
                    expect.objectContaining(blog2)
                ])
            );
        });
    })
    describe('POST /blogs', () => {
        // Проверка ошибок авторизации
        it('should return 401 status if authorization header is missing', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            await request(app)
                .post(blogsPath)
                .send(newBlog)
                .expect(401);
        });
        it('should return 401 status if authorization header has invalid value', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            await request(app)
                .post(blogsPath)
                .set('Authorization', 'InvalidToken') // Неправильное значение заголовка авторизации
                .send(newBlog)
                .expect(401);
        });
        // Проверка ошибок валидации
        it('should return 400 status if required fields are missing', async () => {
            // Отправляем запрос на создание блога без обязательных полей
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({})
                .expect(400);

            // Проверяем, что в ответе есть сообщение об ошибке о недостающих полях
            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: 'name',
                        'message': 'name must be string with maximum length 15 characters'
                    },
                    {
                        field: 'description',
                        message: 'description must be string with maximum length 500 characters'
                    },
                    {
                        field: 'websiteUrl',
                        message: 'websiteUrl must be string with url format and maximum length 100 characters'
                    }
                ]
            });
        });
        it('should return 400 status if name field is missing', async () => {
            // Отправляем запрос на создание блога без поля name
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({description: 'Test description', websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: 'name',
                        message: 'name must be string with maximum length 15 characters'
                    }
                ]
            });
        });
        it('should return 400 status if name field is empty', async () => {
            // Отправляем запрос на создание блога с пустым полем name
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: '', description: 'Test description', websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: 'name',
                        message: 'name must be string with maximum length 15 characters'
                    }
                ]
            });
        });
        it('should return 400 status if name field exceeds maximum length', async () => {
            // Создаем строку с более чем 15 символами
            const longName = 'a'.repeat(16);

            // Отправляем запрос на создание блога с именем, превышающим максимальную длину
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: longName, description: 'Test description', websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: 'name',
                        message: 'name must be string with maximum length 15 characters'
                    }
                ]
            });
        });
        it('should return 400 status if name field is not a string', async () => {
            // Отправляем запрос на создание блога с полем name, которое не является строкой
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 123, description: 'Test description', websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: 'name',
                        message: 'name must be string with maximum length 15 characters'
                    }
                ]
            });
        });
        it('should return 400 status if description field is missing', async () => {
            // Отправляем запрос на создание блога без поля description
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'description',
                    message: 'description must be string with maximum length 500 characters'
                }]
            });
        });
        it('should return 400 status if description field is empty', async () => {
            // Отправляем запрос на создание блога с пустым полем description
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: '', websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'description',
                    message: 'description must be string with maximum length 500 characters'
                }]
            });
        });
        it('should return 400 status if description field exceeds maximum length', async () => {
            // Создаем строку с более чем 100 символами
            const longDescription = 'a'.repeat(501);

            // Отправляем запрос на создание блога с описанием, превышающим максимальную длину
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: longDescription, websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'description',
                    message: 'description must be string with maximum length 500 characters'
                }]
            });
        });
        it('should return 400 status if description field is not a string', async () => {
            // Отправляем запрос на создание блога с полем description, которое не является строкой
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: 123, websiteUrl: 'http://test.com'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'description',
                    message: 'description must be string with maximum length 500 characters'
                }]
            });
        });
        it('should return 400 status if websiteUrl field is missing', async () => {
            // Отправляем запрос на создание блога без поля websiteUrl
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: 'test description'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'websiteUrl',
                    message: 'websiteUrl must be string with url format and maximum length 100 characters'
                }]
            });
        });
        it('should return 400 status if websiteUrl field is empty', async () => {
            // Отправляем запрос на создание блога с пустым полем websiteUrl
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: 'Test description', websiteUrl: ''})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'websiteUrl',
                    message: 'websiteUrl must be string with url format and maximum length 100 characters'
                }]
            });
        });
        it('should return 400 status if websiteUrl field exceeds maximum length', async () => {
            // Создаем строку с более чем 100 символами
            const longWebsiteUrl = 'https://' + 'a'.repeat(90) + '.com';

            // Отправляем запрос на создание блога с URL, превышающим максимальную длину
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: 'Test description', websiteUrl: longWebsiteUrl})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'websiteUrl',
                    message: 'websiteUrl must be string with url format and maximum length 100 characters'
                }]
            });
        });
        it('should return 400 status if websiteUrl field has invalid format', async () => {
            // Отправляем запрос на создание блога с недопустимым форматом URL
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: 'Test description', websiteUrl: 'invalid-url'})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'websiteUrl',
                    message: 'websiteUrl must be string with url format and maximum length 100 characters'
                }]
            });
        });
        it('should return 400 status if websiteUrl field is not a string', async () => {
            // Отправляем запрос на создание блога с полем websiteUrl, которое не является строкой
            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send({name: 'Test blog', description: 'Test description', websiteUrl: 123})
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{
                    field: 'websiteUrl',
                    message: 'websiteUrl must be string with url format and maximum length 100 characters'
                }]
            });
        });
        //Проверка создания блога с валидными данными
        it('should create a new blog and return 201 status', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const response = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(201);

            const createdBlog = response.body;
            expect(createdBlog).toEqual(expect.objectContaining({
                id: expect.any(String),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
                isMembership: expect.any(Boolean)
            }));
            const {id} = createdBlog;
            // Отправляем GET запрос для получения созданного блога по его id
            const getResponse = await request(app)
                .get(`${blogsPath}/${id}`)
                .set('Authorization', authHeader)
                .expect(200);
            // Проверяем, что данные о полученном блоге совпадают с отправленными при создании
            const retrievedBlog = getResponse.body;
            expect(retrievedBlog).toEqual(createdBlog);
        });
    });
    describe('GET /blogs/:id', () => {
        it('should return the blog with status 200 if found', async () => {
            // Создаем новый блог для теста
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };
            const createResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(201);

            // Получаем id созданного блога
            const {id} = createResponse.body;
            // Отправляем GET запрос для получения созданного блога по его id
            const getResponse = await request(app)
                .get(`${blogsPath}/${id}`)
                .set('Authorization', authHeader)
                .expect(200);
            // Проверяем, что в ответе содержится созданный блог
            expect(getResponse.body).toEqual(expect.objectContaining(newBlog));
        });
        it('should return status 404 if blog is not found', async () => {
            // Генерируем случайный id, который не существует в системе
            const nonExistentId = 'nonExistentId123';
            // Отправляем GET запрос для получения блога по несуществующему id и ожидаем статус 404
            await request(app)
                .get(`${blogsPath}/${nonExistentId}`)
                .expect(404);
        });
    });
    describe('PUT /blogs/:id', () => {
        it('should update the blog with status 204 if found and valid data', async () => {
            // Создаем новый блог для теста
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };
            const createResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(201);
            const {id} = createResponse.body;
            // Новые данные для обновления блога
            const updatedBlogData = {
                name: 'Updated Blog',
                description: 'This is an updated test blog',
                websiteUrl: 'http://updatedtestblog.com'
            };
            // Отправляем PUT запрос для обновления блога по его id
            await request(app)
                .put(`${blogsPath}/${id}`)
                .set('Authorization', authHeader)
                .send(updatedBlogData)
                .expect(204);
            // Проверяем, что блог был успешно обновлен
            const getResponse = await request(app)
                .get(`${blogsPath}/${id}`)
                .set('Authorization', authHeader);
            // Проверяем, что в ответе содержатся обновленные данные блога
            expect(getResponse.body).toEqual(expect.objectContaining(updatedBlogData));
        });
        it('should return status 404 if blog to update is not found', async () => {
            // Генерируем случайный id, который не существует в системе
            const nonExistentId = 'nonExistentId123';
            const invalidBlogData = {
                name: 'Updated Blog',
                description: 'This is an updated test blog',
                websiteUrl: 'http://updatedtestblog.com'
            };
            // Отправляем PUT запрос с неверным id для обновления несуществующего блога
            await request(app)
                .put(`${blogsPath}/${nonExistentId}`)
                .set('Authorization', authHeader)
                .send(invalidBlogData)
                .expect(404);
        });
        it('should return status 401 if not authorized', async () => {
            // Отправляем PUT запрос без заголовка авторизации
            const response = await request(app)
                .put(`${blogsPath}/someId`)
                .expect(401);
        });
        it('should return status 400 if data is invalid', async () => {
            // Все проверки на валидацию выполнены в POST /blogs, поэтому здесь только один запрос даем с невалидными данными
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(201);

            const {id} = createResponse.body;
            const invalidBlogData = {
                name: '', // Пустое имя
                description: 123, // Описание не строка
                websiteUrl: 'invalid-url' // Неправильный URL
            };
            // Отправляем PUT запрос с неверными данными для обновления блога
            const response = await request(app)
                .put(`${blogsPath}/${id}`)
                .set('Authorization', authHeader)
                .send(invalidBlogData)
                .expect(400);
            // Проверяем, что в ответе содержится сообщение об ошибке о неверных данных
            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "name",
                        message: "name must be string with maximum length 15 characters"
                    },
                    {
                        field: "description",
                        message: "description must be string with maximum length 500 characters"
                    },
                    {
                        field: "websiteUrl",
                        message: "websiteUrl must be string with url format and maximum length 100 characters"
                    }
                ]
            });
        });
    });
    describe('DELETE /blogs/:id', () => {
        it('should delete the blog with status 204 if found', async () => {
            // Создаем новый блог для теста
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createResponse = await request(app)
                .post(blogsPath)
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(201);
            // Получаем id созданного блога
            const {id} = createResponse.body;
            // Отправляем DELETE запрос для удаления созданного блога по его id
            await request(app)
                .delete(`${blogsPath}/${id}`)
                .set('Authorization', authHeader)
                .expect(204);
            // Пытаемся получить удаленный блог
            const getResponse = await request(app)
                .get(`${blogsPath}/${id}`)
            // Проверяем, что блог не найден (вернулся статус 404)
            expect(getResponse.status).toBe(404);
        });
        it('should return status 404 if blog to delete is not found', async () => {
            // Генерируем случайный id, который не существует в системе
            const nonExistentId = 'nonExistentId123';
            // Отправляем DELETE запрос для удаления блога по несуществующему id и ожидаем статус 404
            await request(app)
                .delete(`${blogsPath}/${nonExistentId}`)
                .set('Authorization', authHeader)
                .expect(404);
        });
        it('should return status 401 if not authorized', async () => {
            // Отправляем DELETE запрос без заголовка авторизации
            const response = await request(app)
                .delete(`${blogsPath}/someId`)
                .expect(401);
            // Проверяем, что в ответе вернулся статус 401
            expect(response.status).toBe(401);
        });
    });
});