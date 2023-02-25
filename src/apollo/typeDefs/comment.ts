export default `

type Comment {
  id: ID!
  userId: ID!
  postId: ID
  motionId: ID
  body: String!
  createdAt: String!
  updatedAt: String!
}

input CreateCommentInput {
  body: String
  images: [FileUpload]
}

input UpdateCommentInput {
  body: String
  images: [FileUpload]
}

type CommentPayload {
  comment: Comment!
}

type CommentsPayload {
  comments: [Comment]
  totalComments: Int!
}

`;
