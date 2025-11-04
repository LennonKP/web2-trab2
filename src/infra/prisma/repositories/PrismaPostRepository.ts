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

    async exists(postId: number): Promise<boolean> {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        return !!post;
    }
}
