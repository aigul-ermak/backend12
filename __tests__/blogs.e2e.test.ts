import request from 'supertest'
import mongoose from 'mongoose'
import {app} from "../src/app";
import dotenv from 'dotenv'

dotenv.config()
import {BlogDBType} from "../src/types/blog/output";

describe('Mongoose integration', () => {
    //const mongoURI = 'mongodb://0.0.0.0:27017/home_works'
    const mongoURI = `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
    let newBlog: BlogDBType | null = null;

    beforeAll(async () => {
        console.log("start connect")
        await mongoose.connect(mongoURI)
        await request(app).delete('/testing/all-data').expect(204);
        console.log("finish connect")
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe('GET blogs', () => {
        it('+ GET blogs', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)

            expect(res_.body.items.length).toBe(0)
        });

        it('POST blog: can\'t create blog if user unauthorized', async () => {
            const res_ = await request(app)
                .post('/blogs')
                .auth('admin', 'qwert')
                .send({
                        "name": "string",
                        "description": "string",
                        "websiteUrl": "https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v"
                    }
                )
                .expect(401)
        });

        it('POST blog: can\'t create blog incorrect value', async (): Promise<void> => {
            const res_ = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty')
                .send({
                        "name": "",
                        "description": "",
                        "websiteUrl": ""
                    }
                )
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": "Incorrect name!",
                            "field": "name"
                        },
                        {
                            "message": "Incorrect description!",
                            "field": "description"
                        },
                        {
                            "message": "Invalid value",
                            "field": "websiteUrl"
                        },
                        {
                            "message": "Incorrect websiteUrl!",
                            "field": "websiteUrl"
                        }
                    ]
                })
        });

        let blog1;
        let blog2;

        it('POST blog: create blog ', async () => {
            const res_ = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty')
                .send({
                        "name": "test name 1",
                        "description": "test description 1",
                        "websiteUrl": "https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v"
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                name: 'test name 1',
                description: 'test description 1',
                websiteUrl: 'https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v',
                createdAt: expect.any(String),
                isMembership: false
            });

            blog1 = res_.body;
        });


// get all blogs

        it('GET blogs all blogs after creating new blog', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)

            expect(res_.body.items).toEqual([blog1!])

        });

        it('POST blog: create blog ', async () => {
            const res_ = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty')
                .send({
                        'name': 'test name 2',
                        'description': 'test description 1',
                        'websiteUrl': 'https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v'
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                name: 'test name 2',
                description: 'test description 1',
                websiteUrl: 'https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v',
                createdAt: expect.any(String),
                isMembership: false
            });

            blog2 = res_.body;

        });

        it('GET blogs all blogs after creating new blog', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)

            expect(res_.body.items).toEqual([blog2!, blog1!])

        });

        // create new post for specific blog
        it('POST blog: create post for specific blog', async () => {
            const res_ = await request(app)
                .post(`/blogs/${blog1!.id}/posts`)
                .auth('admin', 'qwerty')
                .send({
                        'title': 'post 1 for blog 1',
                        'shortDescription': 'description for post 1',
                        'content': 'content for post 1 for blog 1'
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                title: 'post 1 for blog 1',
                shortDescription: 'description for post 1',
                content: 'content for post 1 for blog 1',
                blogId: blog1!.id,
                blogName: blog1!.name,
                createdAt: expect.any(String),
            });

        });

        it('POST blog: create post for specific blog: incorrect values', async () => {
            const res_ = await request(app)
                .post(`/blogs/${blog1!.id}/posts`)
                .auth('admin', 'qwerty')
                .send({
                        'title': '',
                        'shortDescription': '',
                        'content': ''
                    }
                )
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": "Incorrect short description",
                            "field": "shortDescription"
                        },
                        {
                            "message": "Incorrect title",
                            "field": "title"
                        },
                        {
                            "message": "Incorrect content",
                            "field": "content"
                        }

                    ]
                });
        });

        it('POST blog: create post for specific blog: unauthorized', async () => {
            const res_ = await request(app)
                .post(`/blogs/${blog1!.id}/posts`)
                .auth('admin', 'qwert')
                .send({
                        'title': '',
                        'shortDescription': '',
                        'content': ''
                    }
                )
                .expect(401)
        })

        it('POST blog: create post for specific blog: wrong blogId ', async () => {
            const res_ = await request(app)
                .post('/blogs/6671a3a1712b7846f31e667b/posts')
                .auth('admin', 'qwerty')
                .send({
                        'title': 'post 1 for blog 1',
                        'shortDescription': 'description for post 1',
                        'content': 'content for post 1 for blog 1'
                    }
                )
                .expect(404)
        })
//TODO body?
        it('GET blog: posts for specific blog', async () => {
            const res_ = await request(app)
                .get(`/blogs/${blog1!.id}/posts`)
                .expect(200)
        });

        it('GET blog: posts for specific blog: wrong blogId', async () => {
            const res_ = await request(app)
                .get(`/blogs/6671a3a1712b7846f31e667b/posts`)
                .expect(404)
        })

        // get blog by id

        it('GET blogs by id', async () => {
            const res_ = await request(app)
                .get(`/blogs/${blog1!.id}`)
                .expect(200)
        });

//TODO ??? why blog is not found - new blog created
        it('GET blogs by id: not found, wrong blog id', async () => {
            const res_ = await request(app)
                .get('/blogs/6671a3a1712b7846f31e667b')
                .expect(404)
        });

// put
        it('PUT blog: can\'t update blog if user unauthorized', async () => {
            const res_ = await request(app)
                .put(`/blogs/${blog1!.id}`)
                .auth('admin', 'qwert')
                .send({
                        "name": "string",
                        "description": "string",
                        "websiteUrl": "https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v"
                    }
                )
                .expect(401)
        });

        it('PUT blog: can\'t update blog wrong id', async () => {
            const res_ = await request(app)
                .put(`/blogs/6671a3a1712b7846f31e667b`)
                .auth('admin', 'qwerty')
                .send({
                        "name": "string",
                        "description": "string",
                        "websiteUrl": "https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v"
                    }
                )
                .expect(404)
        });

        it('PUT blog', async (): Promise<void> => {
            const res_ = await request(app)
                .put(`/blogs/${blog1!.id}`)
                .auth('admin', 'qwerty')
                .send({
                        "name": "",
                        "description": "",
                        "websiteUrl": ""
                    }
                )
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": "Incorrect name!",
                            "field": "name"
                        },
                        {
                            "message": "Incorrect description!",
                            "field": "description"
                        },
                        {
                            "message": "Invalid value",
                            "field": "websiteUrl"
                        },
                        {
                            "message": "Incorrect websiteUrl!",
                            "field": "websiteUrl"
                        }
                    ]
                })
        });

        it('PUT blog: update blog ', async () => {
            const res_ = await request(app)
                .put(`/blogs/${blog1!.id}`)
                .auth('admin', 'qwerty')
                .send({
                        "name": "test name 1 + 1",
                        "description": "test description 1",
                        "websiteUrl": "https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v"
                    }
                )
                .expect(204);
        });

        it('GET blog after update', async () => {
            const res_ = await request(app)
                .get(`/blogs/${blog1!.id}`)
                .expect(200)

            expect(res_.body).toEqual({
                id: expect.any(String),
                name: 'test name 1 + 1',
                description: 'test description 1',
                websiteUrl: 'https://LimBr082_uipzjm8dF.HNo-1AvOJGJUGKwWlPwd7mE55JcWy2wq_puT2fVSI3cUsTao-xl.iGpAAlxdAe3LguxpFjc5v',
                createdAt: expect.any(String),
                isMembership: false
            });
        });

        //delete

        it('DELETE blog: can\'t delete blog if user unauthorized', async () => {
            const res_ = await request(app)
                .delete(`/blogs/${blog1!.id}`)
                .auth('admin', 'qwert')
                .expect(401)
        });

        it('DELETE blog: can\'t delete blog wrong id', async () => {
            const res_ = await request(app)
                .delete(`/blogs/6671a3a1712b7846f31e667b`)
                .auth('admin', 'qwerty')
                .expect(404)
        });

        it('DELETE blog', async () => {
            const res_ = await request(app)
                .delete(`/blogs/${blog1!.id}`)
                .auth('admin', 'qwerty')
                .expect(204)
        });

// check after delete blog 2
        it('GET blogs all blogs after creating new blog', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)

            expect(res_.body.items).toEqual([blog2!])

        });

    })
})

