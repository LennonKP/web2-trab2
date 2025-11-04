export interface LikeRepository {
  hasLike(userId: number, postId: number): Promise<boolean>;
  createLike(userId: number, postId: number): Promise<void>;
  deleteLike(userId: number, postId: number): Promise<void>;
}
