import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { firebaseSigninMutation } from "../apiMutations";
import { createComment, createReply, deleteComment, editComment, adminDeleteComment } from "../../apiRegression/apiComments/commentMutations";
import { newsQuery } from "../../apiRegression/apiNews/newsQuery";
import { getLatestPostsQuery } from "../../apiRegression/apiPosts/postQueries";
import { getComments, getUnreadDiscussionsQuery } from "../../apiRegression/apiComments/commentQueries";
import { REST_API_URL } from "../apiVariables";

export const contentVariables = {
    objectId: null,
    objectClass: "NEWS",
};

export let createdCommentIds = [];
export let createdReplyIds = [];

export async function authenticate(request, email, password) {
    const restResponse = await request.post(REST_API_URL, {
        data: {
            returnSecureToken: true,
            email: email,
            password: password,
            clientType: "CLIENT_TYPE_WEB",
        },
    });

    const restResponseBody = await restResponse.json();
    const apiURL = process.env.API_URL;

    const graphqlResponse = await request.post(apiURL, {
        data: {
            query: firebaseSigninMutation,
            variables: { idToken: restResponseBody.idToken },
        },
        headers: { "Content-Type": "application/json" },
    });

    const graphqlResponseBody = await graphqlResponse.json();
    return { "X-Auth-Token": graphqlResponseBody.data.authMutations.firebaseSignin.session.token };
};

export async function fetchFirstNewsId(request, apiURL, headers) {
    const response = await request.post(apiURL, {
        data: {
            query: newsQuery,
        },
        headers
    });

    const responseBody = await response.json();
    const newsItems = responseBody?.data?.newsQueries?.feed?.items || [];
    const validNews = newsItems.find(news => !news.commentsDisabled);

    return validNews ? validNews.id : null;
};

export async function fetchFirstPostsId(request, apiURL) {
    const response = await request.post(apiURL, {
        data: {
            query: getLatestPostsQuery,
        },
    });

    const responseBody = await response.json();
    const postItems = responseBody?.data?.postQueries?.feed?.items || [];
    const validPosts = postItems.find(post => !post.commentsDisabled);

    return validPosts ? validPosts.id : null;
};

export async function checkIfCommentExists(request, apiURL, headers, contentVariables, commentID) {
    const checkResponse = await request.post(apiURL, {
        data: {
            query: getComments,
            variables: contentVariables,
        },
        headers: headers,
    });

    const checkResponseBody = await checkResponse.json();
    const comments = checkResponseBody.data.commentsQueries.feed.items;

    function findCommentInThread(thread) {
        for (const comment of thread) {

            if (comment.id === commentID) {
                return true;
            }
            if (comment.childThread?.items?.length > 0) {
                if (findCommentInThread(comment.childThread.items)) {
                    return true;
                }
            }
        }
        return false;
    }

    return findCommentInThread(comments);
};

export async function createCommentFunc(request, apiURL, headers, {
    text,
    userId,
    appName
} = {}) {
    const createResponse = await request.post(apiURL, {
        data: {
            query: createComment,
            variables: {
                commentText: text || `new comment ${faker.random.numeric(4)}`,
                objectId: contentVariables.objectId,
                objectClass: contentVariables.objectClass,
                userId: userId || null,
                appName: appName || null,
            },
        },
        headers,
    });

    const body = await createResponse.json();
    return body.data.commentsMutations.create.id;
};

export async function createReplyFunc(request, apiURL, headers, parentId, text = `reply to comment ${faker.random.numeric(4)}`) {
    const replyResponse = await request.post(apiURL, {
        data: {
            query: createReply,
            variables: {
                commentText: text,
                objectId: contentVariables.objectId,
                objectClass: contentVariables.objectClass,
                parentId: parentId,
            },
        },
        headers: headers,
    });

    const replyResponseBody = await replyResponse.json();
    const createdReplyId = replyResponseBody.data.commentsMutations.create.id;
    createdReplyIds.push(createdReplyId);
    return createdReplyId;
};

export async function editCommentFunc(request, apiURL, headers, commentID, newText = `update comment text ${faker.random.numeric(4)}`) {
    const editResponse = await request.post(apiURL, {
        data: {
            query: editComment,
            variables: {
                commentID: commentID,
                editCommentText: newText,
                objectId: contentVariables.objectId,
                objectClass: contentVariables.objectClass,
            },
        },
        headers: headers
    });

    const editResponseBody = await editResponse.json();
    expect(editResponseBody.errors).toBeUndefined();
    expect(editResponseBody.data.errors).toBeUndefined();
    expect(editResponseBody.data.commentsMutations.editText.text).toBe(newText);

    return newText;
};

export async function deleteCommentFunc(request, apiURL, headers, commentID) {
    const deleteResponse = await request.post(apiURL, {
        data: {
            query: deleteComment,
            variables: {
                commentID: commentID,
                parentObjectID: contentVariables.objectId,
                parentObjectClass: contentVariables.objectClass,
            },
        },
        headers: headers
    });

    const deleteResponseBody = await deleteResponse.json();
    expect(deleteResponseBody.errors).toBeUndefined();
    expect(deleteResponseBody.data.errors).toBeUndefined();
    expect(deleteResponseBody.data.commentsMutations.delete.id).toBe(commentID);
    expect(deleteResponseBody.data.commentsMutations.delete.isDeleted).toBe(true);

    return true;
};

export async function adminDeleteCommentFunc(request, apiURL, headers, commentID) {
    const deleteResponse = await request.post(apiURL, {
        data: {
            query: adminDeleteComment,
            variables: {
                commentID: commentID,
                parentObjectID: contentVariables.objectId,
                parentObjectClass: contentVariables.objectClass,
            },
        },
        headers: headers
    });

    const deleteResponseBody = await deleteResponse.json();
    expect(deleteResponseBody.errors).toBeUndefined();
    expect(deleteResponseBody.data.errors).toBeUndefined();
    expect(deleteResponseBody.data.adminMutations.commentsMutations.delete).toBe(true);

    return true;
};

export async function getUnreadDiscussions(request, apiURL, headers) {
    const response = await request.post(apiURL, {
        data: {
            query: getUnreadDiscussionsQuery,
        },
        headers: headers,
    });

    const responseBody = await response.json();
    return responseBody.data.userDiscussionsQueries.currentUserDiscussions;
};