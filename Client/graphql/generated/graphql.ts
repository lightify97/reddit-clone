import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  parentComment?: Maybe<Scalars['ID']>;
  post: Post;
  postId: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  votes: Scalars['Int'];
};

export type Error = {
  __typename?: 'Error';
  field?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  deleteUser?: Maybe<UserResponse>;
  login?: Maybe<UserResponse>;
  postComment?: Maybe<Comment>;
  registerUser: UserResponse;
  updatePassword: UserResponse;
  updateUser: User;
  voteComment: Comment;
  votePost: Post;
};


export type MutationCreatePostArgs = {
  content?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPostCommentArgs = {
  content: Scalars['String'];
  parentComment?: InputMaybe<Scalars['Int']>;
  postId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationRegisterUserArgs = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  coverImage?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  email: Scalars['String'];
  oldPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  avatar: Scalars['String'];
  bio?: InputMaybe<Scalars['String']>;
  coverImage: Scalars['String'];
  email: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationVoteCommentArgs = {
  id: Scalars['Int'];
  vote?: InputMaybe<VoteOrder>;
};


export type MutationVotePostArgs = {
  postId: Scalars['String'];
  vote?: InputMaybe<VoteOrder>;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  votes: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  post?: Maybe<Post>;
  postComments?: Maybe<Array<Maybe<Comment>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  replies?: Maybe<Array<Maybe<Comment>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};


export type QueryPostCommentsArgs = {
  id: Scalars['String'];
};


export type QueryRepliesArgs = {
  commentId: Scalars['Int'];
};


export type QueryUserArgs = {
  email: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  coverImage?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  posts?: Maybe<Array<Maybe<Post>>>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<Maybe<Error>>>;
  user?: Maybe<User>;
};

export enum VoteOrder {
  Add = 'add',
  Delete = 'delete'
}

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, name: string, email: string } | null, errors?: Array<{ __typename?: 'Error', field?: string | null, message: string } | null> | null } | null };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'Error', field?: string | null, message: string } | null> | null, user?: { __typename?: 'User', id: string, name: string, email: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name: string, email: string, createdAt: string } | null };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      name
      email
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $email: String!) {
  registerUser(username: $username, password: $password, email: $email) {
    errors {
      field
      message
    }
    user {
      id
      name
      email
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    email
    createdAt
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};