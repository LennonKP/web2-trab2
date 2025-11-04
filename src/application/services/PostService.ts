import { Post } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { PostQuery, PostSortBy, SortDirection } from "../ports/PostQuery";

export default class PostService {
    constructor(
        private postRepository: PostRepository,
        private postQuery: PostQuery
    ) { }

    async createPost({ userId, description, imagePath }: { userId: number, description: string, imagePath: string }) {
        const post = new Post({
            authorId: userId,
            description,
            imagePath: imagePath,
        });

        await this.postRepository.save(post);
    }

    async getFeedPosts(userId: number, page: number = 1, sortBy: PostSortBy = "createdAt", sortDirection: SortDirection = 'desc') {
        setTimeout(() => {}, 1000);
        const postsPerPage = 3;
        return this.postQuery.findPaginated(userId, page, postsPerPage, sortBy, sortDirection);
    }
}