import { Prisma } from "@prisma/client";
import { PostFeedItemDTO } from "../../../application/dtos/PostFeedItemDTO";
import { PostQuery, PostSortBy, SortDirection } from "../../../application/ports/PostQuery";
import prisma from "../PrismaClient";

export default class PrismaPostQuery implements PostQuery {
    async findPaginated(
        userId: number,
        page: number,
        limit: number,
        sortBy: PostSortBy,
        sortDirection: SortDirection
    ): Promise<PostFeedItemDTO[]> {
        const skip = (page - 1) * limit;
        const orderBy: Prisma.PostOrderByWithRelationInput = sortBy === "likeCount"
            ? { likes: { _count: sortDirection } }
            : { createdAt: sortDirection };

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            orderBy,
            include: {
                _count: { select: { likes: true } },
                author: { select: { name: true } },
                likes: { where: { userId } }
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
}