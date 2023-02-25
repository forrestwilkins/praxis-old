import { gql } from "apollo-server-micro";
import User from "./user";
import Post from "./post";
import Motion from "./motion";
import Vote from "./vote";
import Comment from "./comment";
import Like from "./like";
import Follow from "./follow";
import Group from "./group";
import GroupMember from "./groupMember";
import Image from "./image";
import Setting from "./setting";
import Role from "./role";
import RoleMember from "./roleMember";
import Permission from "./permission";
import ServerInvite from "./serverInvite";
import Event from "./event";
import EventAttendee from "./eventAttendee";

export const typeDefs = gql`
  scalar FileUpload
  scalar JSON

  ${User}
  ${Post}
  ${Motion}
  ${Vote}
  ${Comment}
  ${Like}
  ${Follow}
  ${Group}
  ${GroupMember}
  ${Image}
  ${Setting}
  ${Role}
  ${RoleMember}
  ${Permission}
  ${ServerInvite}
  ${Event}
  ${EventAttendee}

  union FeedItem = Post | Motion

  type FeedPayload {
    pagedItems: [FeedItem]
    totalItems: Int!
  }

  type Query {
    user(id: ID!): User!
    userByName(name: String!): User!
    allUsers: [User]!
    homeFeed(userId: ID, currentPage: Int!, pageSize: Int!): FeedPayload!
    profileFeed(name: String!, currentPage: Int!, pageSize: Int!): FeedPayload!

    userFollowers(userId: ID!): [Follow]!
    userFollowersByName(name: String!): [Follow]!
    userFollowing(userId: ID!): [Follow]!
    userFollowingByName(name: String!): [Follow]!

    post(id: ID!): Post!
    postsByUserName(name: String!): [Post]
    postsByGroupName(name: String!): [Post]

    motion(id: ID!): Motion!
    motionsByUserName(name: String!): [Motion]
    motionsByGroupName(name: String!): [Motion]

    vote(id: ID!): Vote!
    votesByMotionId(motionId: ID!): [Vote]

    comment(id: ID!): Comment!
    commentsByPostId(postId: ID!): CommentsPayload!
    commentsByMotionId(motionId: ID!): CommentsPayload!

    likesByPostId(postId: ID!): [Like]!
    likesByMotionId(motionId: ID!): [Like]!
    likesByCommentId(commentId: ID!): [Like]!

    group(id: ID!): Group!
    groupByName(name: String!): Group!
    allGroups: [Group]!
    groupFeed(
      name: String!
      currentPage: Int!
      pageSize: Int!
      itemType: String
    ): FeedPayload!
    joinedGroupsByUserId(userId: ID!): [Group]

    groupMembers(groupId: ID!): [GroupMember]
    memberRequests(groupId: ID!): [MemberRequest]

    imagesByPostId(postId: ID!): [Image]
    imagesByMotionId(motionId: ID!): [Image]
    imagesByCommentId(commentId: ID!): [Image]
    profilePicture(userId: ID!): Image
    profilePictures(userId: ID!): [Image]
    coverPhotoByUserId(userId: ID!): Image
    coverPhotoByGroupId(groupId: ID!): Image
    coverPhotoByEventId(eventId: ID!): Image

    settingsByUserId(userId: ID!): [Setting]!
    settingsByGroupId(groupId: ID!): [Setting]!

    role(id: ID!): Role!
    rolesByGroupId(groupId: ID!): [Role]
    globalRoles: [Role]!
    roleMembers(roleId: ID!): [RoleMember]
    permissionsByRoleId(roleId: ID!): [Permission]!
    hasPermissionGlobally(name: String!, userId: ID!): Boolean!
    hasPermissionByGroupId(name: String!, userId: ID!, groupId: ID!): Boolean!

    serverInvite(id: ID!): ServerInvite!
    serverInviteByToken(token: String!): ServerInvite
    allServerInvites: [ServerInvite]

    event(id: ID!): Event!
    allEvents(timeFrame: String, online: Boolean): [Event]
    eventFeed(
      eventId: ID!
      currentPage: Int!
      pageSize: Int!
    ): EventFeedPayload!
    eventsByGroupId(groupId: ID!, timeFrame: String): [Event]
    joinedGroupEventsByUserId(
      userId: ID!
      timeFrame: String
      online: Boolean
    ): [Event]
    eventAttendees(eventId: ID!): [EventAttendee]
  }

  type Mutation {
    signUp(input: SignUpInput!): UserPayload!
    signIn(input: SignInInput!): UserPayload!
    updateUser(id: ID!, input: UpdateUserInput!): UserPayload!
    deleteUser(id: ID!): Boolean!

    createFollow(userId: ID!, followerId: ID!): FollowPayload!
    deleteFollow(id: ID!): Boolean!

    createPost(
      userId: ID!
      groupId: ID
      eventId: ID
      input: CreatePostInput!
    ): PostPayload!
    updatePost(id: ID!, input: UpdatePostInput!): PostPayload!
    deletePost(id: ID!): Boolean!

    createMotion(
      userId: ID!
      groupId: ID
      input: CreateMotionInput!
    ): MotionPayload!
    updateMotion(id: ID!, input: UpdateMotionInput!): MotionPayload!
    deleteMotion(id: ID!): Boolean!

    createVote(userId: ID!, motionId: ID, input: CreateVoteInput!): VotePayload!
    updateVote(id: ID!, input: UpdateVoteInput!): VotePayload!
    deleteVote(id: ID!): Boolean!

    createComment(
      userId: ID!
      postId: ID
      motionId: ID
      input: CreateCommentInput!
    ): CommentPayload!
    updateComment(id: ID!, input: UpdateCommentInput!): CommentPayload!
    deleteComment(id: ID!): Boolean!

    createLike(
      userId: ID!
      postId: ID
      motionId: ID
      commentId: ID
    ): LikePayload!
    deleteLike(id: ID!): Boolean!

    createGroup(creatorId: ID!, input: CreateGroupInput!): GroupPayload!
    updateGroup(id: ID!, input: UpdateGroupInput!): GroupPayload!
    deleteGroup(id: ID!): Boolean!

    createMemberRequest(groupId: ID!, userId: ID!): MemberRequestPayload!
    deleteMemberRequest(id: ID!): Boolean!
    deleteGroupMember(id: ID!): Boolean!
    approveMemberRequest(id: ID!): GroupMemberPayload!
    denyMemberRequest(id: ID!): MemberRequestPayload!

    deleteImage(id: ID!): Boolean!

    updateSettings(input: UpdateSettingsInput!): SettingsPayload!

    createRole(
      groupId: ID
      global: Boolean
      input: CreateRoleInput!
    ): RolePayload!
    updateRole(id: ID!, input: UpdateRoleInput!): RolePayload!
    deleteRole(id: ID!): Boolean!
    initializeAdminRole(userId: ID!): RolePayload!

    addRoleMembers(roleId: ID!, input: AddRoleMembersInput!): RoleMemberPayload!
    deleteRoleMember(id: ID!): Boolean!

    updatePermissions(input: UpdatePermissionsInput!): PermissionsPayload!

    createServerInvite(
      userId: ID!
      input: CreateServerInviteInput!
    ): ServerInvitePayload!
    redeemServerInvite(token: String!): ServerInvitePayload
    deleteServerInvite(id: ID!): Boolean!

    createEvent(
      userId: ID!
      groupId: ID
      input: CreateEventInput!
    ): EventPayload!
    updateEvent(id: ID!, input: UpdateEventInput!): EventPayload!
    deleteEvent(id: ID!): Boolean!

    createEventAttendee(
      eventId: ID!
      userId: ID!
      input: CreateEventAttendeeInput!
    ): EventAttendeePayload!
    deleteEventAttendee(id: ID!): Boolean!
  }
`;
