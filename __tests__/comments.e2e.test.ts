import request from 'supertest'
import mongoose from 'mongoose'
import {app} from "../src/app";
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import {settings} from "../src/services/settings";

dotenv.config();

let blog1;
let post1;
let user1;
let user2;
let user3;
let user4;
let comment1;
let comment2;
let comment3;
let comment4;
let comment5;
let comment6;

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

    describe('GET comments', () => {

        //create blog
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

            post1 = res_.body;
        });

        //create user1
        it('POST user: create user 1', async () => {
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
        });
        //create user2
        it('POST user: create user 2', async () => {
            const res_ = await request(app)
                .post(`/users`)
                .auth('admin', 'qwerty')
                .send({
                        "login": "aig666",
                        "password": "password",
                        "email": "ex@example.com"
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                login: "aig666",
                email: "ex@example.com",
                createdAt: expect.any(String),
            });

            user2 = res_.body;
        });

        it('POST user: create user 3', async () => {
            const res_ = await request(app)
                .post(`/users`)
                .auth('admin', 'qwerty')
                .send({
                        "login": "aig777",
                        "password": "password",
                        "email": "ex777@example.com"
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                login: "aig777",
                email: "ex777@example.com",
                createdAt: expect.any(String),
            });

            user3 = res_.body;
        });

        it('POST user: create user 4', async () => {
            const res_ = await request(app)
                .post(`/users`)
                .auth('admin', 'qwerty')
                .send({
                        "login": "aig888",
                        "password": "password",
                        "email": "ex888@example.com"
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                login: "aig888",
                email: "ex888@example.com",
                createdAt: expect.any(String),
            });

            user4 = res_.body;
        });

        //create comments for post

        it('POST post: create comment', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 1',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 1',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

            comment1 = res_.body;
            console.log(comment1.id);
        });


        it('GET comments: not found', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/6696894a120b37db0d917817`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });

        // get comment by id
        it('GET comments', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: "content for comment 1",
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

        });
        // put comment
        it('PUT comments: unauthorized', async () => {
            const res_ = await request(app)
                .put(`/comments/${comment1!.commentId}`)
                .auth('admin', 'qwert')
                .send({
                        'content': 'new content new content',
                    }
                )
                .expect(401)

        });

        it('PUT comments: not found', async () => {

            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/666c7d3a7cb61ded043586cd`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'new content new content',
                    }
                )
                .expect(404)

        });

        it('PUT comments: if try edit comment that is not your own', async () => {

            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'new content new content',
                    }
                )
                .expect(403)

        });

        //create comment
        it('PUT comment', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 1.1',
                    }
                )
                .expect(204);
        });

        // create comment 2
        it('POST post: create comment 2', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 2',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 2',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

            comment2 = res_.body;
            console.log(comment2.id);
        });

        // create comment 3
        it('POST post: create comment 3', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 3',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 3',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });
            comment3 = res_.body;
            console.log(comment3.id);
        });

        // create comment 4
        it('POST post: create comment 4', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 4',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 4',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });
            comment4 = res_.body;
            console.log(comment4.id);
        });

        // create comment 5
        it('POST post: create comment 5', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 5',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 5',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });
            comment5 = res_.body;
            console.log(comment5.id);
        });

        // create comment 6
        it('POST post: create comment 6', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .post(`/posts/${post1!.id}/comments`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'content': 'content for comment 6',
                    }
                )
                .expect(201);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 6',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });
            comment6 = res_.body;
            console.log(comment6.id);
        });

        //get comment by id
        it('GET comments', async () => {
            const res_ = await request(app)
                .get(`/comments/${comment2!.id}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 2',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

        });

        // put like unauthorized
        it('PUT like to comments: unauthorized', async () => {
            const res_ = await request(app)
                .put(`/comments/${comment1!.id}/like-status`)
                .auth('admin', 'qwert')
                .send({
                        'likeStatus': 'None'
                    }
                )
                .expect(401)

        });

        // put like wrong comment id
        it('PUT comments: not found', async () => {

            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/666c7d3a7cb61ded043586cd/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'None'
                    }
                )
                .expect(404)

        });

        // put like error messages
        it('PUT like in comment: incorrect values', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': ''
                    }
                )
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": "Invalid value",
                            "field": "likeStatus"
                        }
                    ]
                });

        });


        // create like - status none
        it('PUT like to comment', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'None'
                    }
                )
                .expect(204);
        });

        // create like - status like user 1
        it('PUT like to comment - user 1', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        //get comment by id
        it('GET comments after user 1 put like', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 1.1',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        // create like - status like user 2
        it('PUT like to comment - user 2', async () => {
            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 2 put like', async () => {
            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 1.1',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 2,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        it('GET comments if user unauth', async () => {
            let userId = '66981ac0cf7c9a1c694ad92j';
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 1.1',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 2,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

        });

        it('GET comments if user ""', async () => {
            let userId = '';
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 1.1',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 2,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            });

        });

        // create like - status like user 2
        it('PUT like to comment - user 2', async () => {
            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment2!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 2 put like', async () => {
            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment2!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 2',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        // create like - status like user 3
        it('PUT like to comment - user 3', async () => {
            let userId = user3!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment2!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 3 put like', async () => {
            let userId = user3!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment2!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 2',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 2,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        // create like - status like user 1
        it('PUT like to comment 3 - user 1', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment3!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Dislike'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 1 put dislike', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment3!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 3',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike'
                }
            });

        });

        // create like - status like user 1
        it('PUT like to comment 3 - user 1', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment4!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 1 put like', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment4!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 4',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        // create like - status like user 4
        it('PUT like to comment 4 - user 4', async () => {
            let userId = user4!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment4!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 4 put like', async () => {
            let userId = user4!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment4!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 4',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 2,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        // create like - status like user 4
        it('PUT like to comment 4 - user 2', async () => {
            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment4!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 2 put like', async () => {
            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment4!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 4',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 3,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        // create like - status like user 4
        it('PUT like to comment 4 - user 3', async () => {
            let userId = user3!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment4!.id}/like-status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                        'likeStatus': 'Like'
                    }
                )
                .expect(204);
        });

        it('GET comments after user 3 put like', async () => {
            let userId = user3!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .get(`/comments/${comment4!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res_.body).toEqual({
                id: expect.any(String),
                content: 'content for comment 4',
                commentatorInfo: {
                    userId: user1!.id,
                    userLogin: user1!.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 4,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            });

        });

        it('PUT comment: incorrect values', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .put(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
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

        //delete
        it('DELETE comment: unauthorized', async () => {
            const res_ = await request(app)
                .delete(`/comments/${comment1!.commentId}`)
                .auth('admin', 'qwert')
                .expect(401)
        });

        it('DELETE comment: not found', async () => {
            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .delete(`/comments/6679b37eac60d2f87de0ece4`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)
        });

        it('DELETE comment: if try delete comment that is not your own', async () => {

            let userId = user2!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .delete(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(403)
        });

        it('DELETE comment', async () => {

            let userId = user1!.id;
            const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: settings.ACCESS_TOKEN_EXPIRY});

            const res_ = await request(app)
                .delete(`/comments/${comment1!.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
        });

    })
})

