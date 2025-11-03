export class Like {
  private userId: number;
  private postId: number;
  private createdAt: Date;

  constructor(props: { userId: number; postId: number; createdAt?: Date }) {
    this.userId = props.userId;
    this.postId = props.postId;
    this.createdAt = props.createdAt ?? new Date();
  }

  getUserId() {
    return this.userId;
  }

}
