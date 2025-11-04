import { Response } from 'express';
import PostService from '../../../application/services/PostService';
import LikeService from '../../../application/services/LikeService';
import formidable from 'formidable';
import path from 'path';
import { rm } from 'fs/promises';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export default class PostController {
    constructor(private postService: PostService, private likeService: LikeService) { }

    public async renderFeed(req: AuthenticatedRequest, res: Response) {
        const posts = await this.postService.getFeedPosts(req.user!.userId, 1, 'createdAt', 'desc');
        res.render('home', { posts });
    }

    public renderPublishPage(req: AuthenticatedRequest, res: Response) {
        res.render('publish', { user: req.user });
    }

    public async handlePublish(req: AuthenticatedRequest, res: Response) {
        let savedFilepath: string | undefined;
        let fields: formidable.Fields | undefined;
        let files: formidable.Files | undefined;

        try {
            const userId = req.user?.userId as number;
            const form = formidable({
                uploadDir: path.join(__dirname, '..', '..', '..', '..', 'public/uploads', `${userId}`),
                createDirsFromUploads: true,
                keepExtensions: true,
                filename: (_name, _ext, part) => `post_${Date.now()}${path.extname(part.originalFilename || '.png')}`
            });

            [fields, files] = await form.parse(req);
            const imageFile = files.imagem?.[0];
            if (!imageFile) throw new Error("No image file was uploaded.");

            savedFilepath = imageFile.filepath;
            const description = fields.description![0] || ''
            const imagePath = `/uploads/${userId}/${imageFile.newFilename}`;

            await this.postService.createPost({ userId, description, imagePath });
            res.redirect('/');
        } catch (error: any) {
            if (savedFilepath) await rm(savedFilepath, { force: true });
            res.render('publish', {
                user: req.user,
                error: error.message,
                oldInput: fields
            });
        }
    }

    public async getApiPosts(req: AuthenticatedRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const userId = req.user!.userId;
            const sortBy = req.query.sortBy as string === 'likeCount' ? 'likeCount' : 'createdAt'
            const sortDirection = req.query.sortDirection as string === 'asc' ? 'asc' : 'desc';
            const posts = await this.postService.getFeedPosts(userId, page, sortBy, sortDirection);
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Could not fetch posts' });
        }
    }

    public async toggleApiLike(req: AuthenticatedRequest, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const userId = req.user!.userId;
            const result = await this.likeService.toggleLike(userId, postId);
            res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: 'Could not toggle like' });
        }
    }
}