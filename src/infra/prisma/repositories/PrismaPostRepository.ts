import { PostFeedItemDTO } from "../../../application/dtos/PostFeedItemDTO";
import { Post } from "../../../domain/entities/Post";
import { PostRepository } from "../../../domain/repositories/PostRepository";
import prisma from "../PrismaClient";

export default class PrismaPostRepository implements PostRepository {
    async save(post: Post): Promise<void> {
        const { id } = await prisma.post.create({
            data: {
                authorId: post.getAuthorId(),
                description: post.getDescription(),
                imagePath: post.getImagePath(),
            },
        });
        post.setId(id);
    }

    async findPaginated(userId: number, page: number, limit: number): Promise<PostFeedItemDTO[]> {
        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            skip: skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { likes: true } },
                author: { select: { name: true } },
                likes: { where: { userId: userId } }
            }
        });

        return posts.map(post => ({
            id: post.id,
            description: post.description || '',
            imagePath: post.imagePath,
            authorName: post.author.name,
            createdAt: post.createdAt,
            likeCount: post._count.likes,
            isLiked: post.likes.length > 0
        }));
    }

    async findLike(userId: number, postId: number) {
        return prisma.like.findUnique({
            where: { userId_postId: { userId, postId } }
        });
    }

    async createLike(userId: number, postId: number): Promise<void> {
        await prisma.like.create({
            data: { userId, postId }
        });
    }

    async deleteLike(userId: number, postId: number): Promise<void> {
        await prisma.like.delete({
            where: { userId_postId: { userId, postId } }
        });
    }
}
