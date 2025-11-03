export interface PostFeedItemDTO {
    id: number;
    description: string;
    imagePath: string;
    authorName: string; 
    createdAt: Date;
    likeCount: number;
    isLiked: boolean;
}