export type Comment = {
  commentId: number,
  userId: number,
  userName: string,
  userAvatar: null,
  content: string,
  parentId: number,
  rootId: number,
  likeCount: number,
  createTime: string,
  children: Comment[],
  liked: boolean,
  mine: boolean
}