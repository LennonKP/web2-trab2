import { PostRepository } from "../../domain/repositories/PostRepository";
import { LikeRepository } from "../../domain/repositories/LikeRepository";

export default class LikeService {
  constructor(
    private postRepository: PostRepository,
    private likeRepository: LikeRepository
  ) {}

  async toggleLike(userId: number, postId: number) {
    const postExists = await this.postRepository.exists(postId);
    if (!postExists) throw new Error("Post not found");

    const hasLiked = await this.likeRepository.hasLike(userId, postId);
    if (hasLiked) {
      await this.likeRepository.deleteLike(userId, postId);
      return 
    }

    await this.likeRepository.createLike(userId, postId);
  }
}
