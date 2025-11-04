import prisma from "../PrismaClient";
import { LikeRepository } from "../../../domain/repositories/LikeRepository";

export default class PrismaLikeRepository implements LikeRepository {
  async hasLike(userId: number, postId: number): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!like;
  }

  async createLike(userId: number, postId: number): Promise<void> {
    await prisma.like.create({ data: { userId, postId } });
  }

  async deleteLike(userId: number, postId: number): Promise<void> {
    await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
  }
}
