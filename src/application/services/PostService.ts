import { Post } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/repositories/PostRepository";

export default class PostService {
    constructor(private postRepository: PostRepository) { }

    async createPost({ userId, description, imagePath }: { userId: number, description: string, imagePath: string }) {
        const post = new Post({
            authorId: userId,
            description,
            imagePath: imagePath,
        });

        await this.postRepository.save(post);
    }

    async getFeedPosts(userId: number, page: number = 1, sortBy: string = 'date') {
        const postsPerPage = 2;
        return this.postRepository.findPaginated(userId, page, postsPerPage, sortBy);
    }

    async toggleLike(userId: number, postId: number) {
        const hasLiked = await this.postRepository.findLike(userId, postId);
        if (hasLiked) {
            await this.postRepository.deleteLike(userId, postId);
            return
        }

        await this.postRepository.createLike(userId, postId);
    }
}