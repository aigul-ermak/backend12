import request from 'supertest'
import mongoose from 'mongoose'
import {app} from "../src/app";
import dotenv from 'dotenv'
import {OutputItemBlogType} from "../src/types/blog/output";
import {OutputItemPostType, PostDBType} from "../src/types/post/output";
import jwt from "jsonwebtoken";
import {settings} from "../src/services/settings";


dotenv.config();

let blog1: OutputItemBlogType;
let post1: OutputItemPostType;
//TODO type??
let user1: any;

describe('Mongoose integration', () => {
    //const mongoURI = 'mongodb://0.0.0.0:27017/home_works'
    const mongoURI = `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;


    beforeAll(async () => {
        console.log("start connect")
        await mongoose.connect(mongoURI)
        await request(app).delete('/testing/all-data').expect(204);
        console.log("finish connect")
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

    // get all posts - empty
    describe('GET all posts', () => {
        it('GET all posts blogs', async () => {
            const res_ = await request(app)
                .get('/posts')
                .expect(200)
            expect(res_.body.items.length).toBe(0)
        });

        // create post 401
        it('POST post: create post: unauthorized', async () => {
            const res_ = await request(app)
                .post('/posts')
                .auth('admin', 'qwert')
                .send({
                        'title': 'post 1.1',
                        'shortDescription': 'description 1',
                        'content': 'content 1',
                        'blogId': ''
                    }
                )
                .expect(401)
        });


        // create post 400
        it('POST post: create post: incorrect values', async () => {
            const res_ = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                        'title': '',
                        'shortDescription': '',
                        'content': '',
                        'blogId': ''
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
                        },
                        {
                            "message": "Invalid value",
                            "field": "blogId"
                        },
                        {
                            "message": "Incorrect mongoid blogid",
                            "field": "blogId"
                        },
                        {
                            "message": "Incorrect blogId",
                            "field": "blogId"
                        }

                    ]
                });
        });


        // create blog first for create post


        it('POST blog: create blog ', async () => {
            const res_ = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty')
                .send({
                        'name': 'blog 1',
                        'description': 'blog description 1',
                        'websiteUrl': 'https://blog.com'
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                name: 'blog 1',
                description: 'blog description 1',
                websiteUrl: 'https://blog.com',
                createdAt: expect.any(String),
                isMembership: false
            });

            blog1 = res_.body;
        })

        // create post 201

        it('POST post: create post', async () => {
            const res_ = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                        'title': 'post 1',
                        'shortDescription': 'description 1',
                        'content': 'content 1',
                        'blogId': blog1.id,
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                title: 'post 1',
                shortDescription: 'description 1',
                content: 'content 1',
                blogId: blog1.id,
                blogName: blog1.name,
                createdAt: expect.any(String),
            });

            post1 = res_.body;

        });


        // get all posts
        it('GET all posts with new post 1', async () => {
            const res_ = await request(app)
                .get('/posts')
                .expect(200)

            expect(res_.body.items).toEqual([post1!])
        });

        //get post by id

        it('GET post by id', async () => {
            console.log(post1)
            const res_ = await request(app)
                .get(`/posts/${post1!.id}`)
                .expect(200)
        });


        it('GET post by id not found', async () => {
            const res_ = await request(app)
                .get('/posts/66798b7a906543743847e066')
                .expect(404)
        });

        // put post

        it('PUT post', async () => {
            const res_ = await request(app)
                .put(`/posts/${post1!.id}`)
                .auth('admin', 'qwerty')
                .send({
                        'title': 'new title for post 1',
                        'shortDescription': 'new description 1',
                        'content': 'content 1',
                        'blogId': blog1.id,
                    }
                )
                .expect(204);
        });

        it('PUT post: incorrect values', async () => {
            const res_ = await request(app)
                .put(`/posts/${post1!.id}`)
                .auth('admin', 'qwerty')
                .send({
                        'title': '',
                        'shortDescription': '',
                        'content': '',
                        'blogId': ''
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
                        },
                        {
                            "message": "Invalid value",
                            "field": "blogId"
                        },
                        {
                            "message": "Incorrect mongoid blogid",
                            "field": "blogId"
                        },
                        {
                            "message": "Incorrect blogId",
                            "field": "blogId"
                        }

                    ]
                });
        });

        it('PUT post: unauthorized', async () => {
            const res_ = await request(app)
                .put(`/posts/${post1!.id}`)
                .auth('admin', 'qwert')
                .send({
                        'title': 'new title for post 1',
                        'shortDescription': 'new description 1',
                        'content': 'content 1',
                        'blogId': blog1.id,
                    }
                )
                .expect(401);
        });

        it('PUT post: not found', async () => {
            const res_ = await request(app)
                .post(`/posts/123`)
                .auth('admin', 'qwerty')
                .send({
                        'title': 'new title for post 1',
                        'shortDescription': 'new description 1',
                        'content': 'content 1',
                        'blogId': blog1.id,
                    }
                )
                .expect(404);
        });

//delete post
        it('DELETE post: unauthorized', async () => {
            const res_ = await request(app)
                .delete(`/blogs/${post1!.id}`)
                .auth('admin', 'qwert')
                .expect(401)
        });

        it('DELETE post: not found', async () => {
            const res_ = await request(app)
                .delete(`/blogs/66798b7a906543743847e066`)
                .auth('admin', 'qwerty')
                .expect(404)
        });

        //create user
        it('POST user: create user', async () => {
            const res_ = await request(app)
                .post(`/users`)
                .auth('admin', 'qwerty')
                .send({
                        "login": "aig555",
                        "password": "password",
                        "email": "example@example.com"
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                login: "aig555",
                email: "example@example.com",
                createdAt: expect.any(String),
            });

            user1 = res_.body;
            console.log(user1)
        });


        it('POST post: create comment: incorrect values', async () => {
            let userId = user1.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                //.auth('admin', 'qwerty')
                .send({
                        'content': '',
                    }
                )
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": "Incorrect comment",
                            "field": "content"
                        },
                    ]
                });

        });

        it('POST post: create comment: unauthorized', async () => {
            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .auth('admin', 'qwert')
                .send({
                        'content': 'content 1',
                    }
                )
                .expect(401)
        });

        it('POST post: create comment: wrong postId', async () => {
            let userId = user1.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/66798b7a906543743847e066/comments`)
                .set('Authorization', `Bearer ${token}`)
                //.auth('admin', 'qwerty')
                .send({
                        'content': 'content 1',
                    }
                )
                .expect(404)
        });


        //create comments for post

        it('POST post: create comment', async () => {
            let userId = user1.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET,
                {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                //.auth('admin', 'qwerty')
                .send({
                        'content': 'content content content',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content content content',
                commentatorInfo: {
                    userId: user1.id,
                    userLogin: user1.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

        });


        it('DELETE post', async () => {
            console.log(post1)
            const res_ = await request(app)
                .delete(`/posts/${post1!.id}`)
                .auth('admin', 'qwerty')
                .expect(204)
        });

        it('GET all posts after delete', async () => {
            const res_ = await request(app)
                .get('/posts')
                .expect(200)
            expect(res_.body.items.length).toBe(0)
        });

    })
})

