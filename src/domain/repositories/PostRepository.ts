import { PostFeedItemDTO } from "../../application/dtos/PostFeedItemDTO";
import { Post } from "../entities/Post";

export interface PostRepository {
    save(post: Post): Promise<void>;
    findPaginated(userId: number, page: number, limit: number, sortBy: string): Promise<PostFeedItemDTO[]>;
    
    findLike(userId: number, postId: number): Promise<any>;
    createLike(userId: number, postId: number): Promise<void>;
    deleteLike(userId: number, postId: number): Promise<void>;
}
