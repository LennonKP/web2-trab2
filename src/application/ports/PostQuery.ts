import { PostFeedItemDTO } from "../dtos/PostFeedItemDTO";

export type PostSortBy = 'createdAt' | 'likeCount';
export type SortDirection = 'asc' | 'desc';

export interface PostQuery {
    findPaginated(userId: number, page: number, limit: number, sortBy: PostSortBy, sortDirection: SortDirection): Promise<PostFeedItemDTO[]>;
}