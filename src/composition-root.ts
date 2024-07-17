import {UserRepo} from "./repositories/user-repo/user-repo";
import {UserService} from "./services/user-service";
import {UserController} from "./controllers/userController";
import {AuthService} from "./services/auth-service";
import {AuthController} from "./controllers/authController";
import {CommentService} from "./services/comment-service";
import {CommentRepo} from "./repositories/comment-repo/comment-repo";
import {CommentController} from "./controllers/commentController";
import {BlogRepo} from "./repositories/blog-repo/blog-repo";
import {BlogService} from "./services/blog-service";
import {BlogController} from "./controllers/blogController";
import {PostRepo} from "./repositories/post-repo/post-repo";
import {PostService} from "./services/post-service";
import {PostController} from "./controllers/postController";
import {LikeCommentRepo} from "./repositories/like-repo/like-comment-repo";
import {LikeCommentService} from "./services/like-comment-service";

const userRepo = new UserRepo();
const commentRepo = new CommentRepo();
const blogRepo = new BlogRepo();
const postRepo = new PostRepo();
const likeCommentRepo = new LikeCommentRepo();

export const userService = new UserService(userRepo);
const authService = new AuthService(userRepo);
const commentService = new CommentService(commentRepo, likeCommentRepo);
const blogService = new BlogService(blogRepo, postRepo);
const postService = new PostService(postRepo, blogRepo);
const likeCommentService = new LikeCommentService(likeCommentRepo, commentRepo);


export const userController = new UserController(userService);
export const authController = new AuthController(authService, userService);
export const commentController = new CommentController(commentService, likeCommentService );
export const blogController = new BlogController(blogService, postService);
export const postController = new PostController(postService, commentService);
