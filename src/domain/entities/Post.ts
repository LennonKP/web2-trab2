import { Like } from "./Like";

export class Post {
  private id: number | undefined;
  private authorId: number;
  private description: string ;
  private imagePath: string;
  private likes: Like[];
  private createdAt: Date;

  constructor(props: { id?: number, authorId: number, description: string, imagePath: string, likes?: Like[], createdAt?: Date }) {
    this.id = props.id ?? undefined;
    this.description = props.description;
    this.authorId = props.authorId;
    this.imagePath = props.imagePath;
    this.likes = props.likes ?? [];
    this.createdAt = props.createdAt ?? new Date();
  }

  getId() {
    return this.id;
  }

  getAuthorId() {
    return this.authorId;
  }

  getImagePath() {
    return this.imagePath;
  }

  getDescription() {
    return this.description;
  }

  setId(id: number) {
    this.id = id;
  }
}
