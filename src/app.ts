import express from 'express';
import cookieParser from 'cookie-parser';

import PrismaUserRepository from './infra/prisma/repositories/PrismaUserRepository';
import BcryptHashProvider from './infra/providers/bcryptHashProvider';
import JsonWebTokenProvider from './infra/providers/jsonwebtokenJwtProvider';
import PrismaPostRepository from './infra/prisma/repositories/PrismaPostRepository';
import AuthService from './application/services/AuthService';
import PostService from './application/services/PostService';
import createAuthMiddleware from './infra/http/middleware/authRequired';
import PostController from './infra/http/controllers/PostController';
import AuthController from './infra/http/controllers/AuthController';

const postRepository = new PrismaPostRepository()
const postService = new PostService(postRepository)
const postController = new PostController(postService)

const userRepository = new PrismaUserRepository()
const hashProvider = new BcryptHashProvider()
const jwtProvider = new JsonWebTokenProvider()
const authService = new AuthService(userRepository, hashProvider, jwtProvider)
const authController = new AuthController(authService)

const authRequiredMiddleware = createAuthMiddleware(jwtProvider)

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(cookieParser())

app.get('/auth/login', (req, res) => authController.renderLoginPage(req, res));
app.get('/auth/register', (req, res) => authController.renderRegisterPage(req, res));
app.post('/auth/login', (req, res) => authController.handleLogin(req, res));
app.post('/auth/register', (req, res) => authController.handleRegister(req, res));
app.get('/auth/signout', authRequiredMiddleware, (req, res) => authController.handleSignout(req, res))

app.get('/', authRequiredMiddleware, (req, res) => postController.renderFeed(req, res))
app.get('/publish', authRequiredMiddleware, (req, res) => postController.renderPublishPage(req, res))
app.post('/publish', authRequiredMiddleware, (req, res) => postController.handlePublish(req, res))

app.get('/api/posts', authRequiredMiddleware, (req, res) => postController.getApiPosts(req, res))
app.post('/api/posts/:id/like', authRequiredMiddleware, (req, res) => postController.toggleApiLike(req, res))

app.use((_req, res) => res.status(404).send("NOT FOUND"))
app.listen(3000, _ => console.log("http://localhost:3000"));