import express from "express";

import {videosRouter} from "../routes/videos-router";
import {blogRouter} from "../routes/blog-router";
import {postRouter} from "../routes/post-router";
import {testingRouter} from "../routes/testing-router";
import {userRouter} from "../routes/user-router";
import {authRouter} from "../routes/auth-router";
import {commentRouter} from "../routes/comment-router";
import {securityRouter} from "../routes/security-router";

import morganBody from "morgan-body";
import bodyParser  from "body-parser";

export const configApp = () => {
    const app = express()

    const cookieParser = require('cookie-parser');

    app.use(cookieParser())
    morganBody(app)//
    app.use(bodyParser.json())
    app.use(express.json())

    app.use('/auth', authRouter)
    app.use('/videos', videosRouter)
    app.use('/blogs', blogRouter)
    app.use('/posts', postRouter)
    app.use('/users', userRouter)
    app.use('/comments', commentRouter)
    app.use('/security', securityRouter)
    app.use('/testing', testingRouter)

    return app;
}







