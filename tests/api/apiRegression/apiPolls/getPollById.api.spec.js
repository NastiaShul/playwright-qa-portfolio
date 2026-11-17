import { test, expect } from "@playwright/test";
import { appsInt, appsUA } from '../../../../src/constants';
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { getPollsListQuery, getPollByIdQuery, getPollById, PollById } from "./pollQueries";

const apiURL = process.env.API_URL
const project = await checkProject(apiURL)
const languages = await languageForProject(project)

test('Check if getPollByIdQuery query works ', async ({ request }, testInfo) => {
    for (let language of languages) {
        const pollListResponse = await request.post(apiURL, {
            data: {
                query: getPollsListQuery,
                variables: { lang: language }
            },
        });

        const pollListResponseBody = await pollListResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: pollListResponseBody
        });

        expect(pollListResponseBody.errors).toBeUndefined();
        const pollItems = pollListResponseBody?.data?.pollQueries?.feed?.items || [];
        expect(pollItems).toBeDefined();
        const pollID = pollItems[0]?.id;

        if (!pollID) {
            continue;
        } else {
            const pollResponse = await request.post(apiURL, {
                data: {
                    query: getPollByIdQuery,
                    variables: { lang: language, pollID: pollID }
                },
            });
            const pollResponseBody = await pollResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: pollResponseBody
            });

            expect(pollResponseBody.errors).toBeUndefined();
            const pollData = pollResponseBody?.data?.pollQueries?.get;
            expect(pollData).toBeDefined();

            expect(pollData.id).toBeDefined();
            expect(typeof pollData.id).toBe('string');
            expect(pollData.status).toBeDefined();
            expect(typeof pollData.status).toBe('string');
            expect(pollData.isVoted).toBeDefined();
            expect(typeof pollData.isVoted).toBe('boolean');
            expect(pollData.totalVotes).toBeDefined();
            expect(typeof pollData.totalVotes).toBe('number');
            expect(pollData.commentsCount).toBeDefined();
            expect(typeof pollData.commentsCount).toBe('number');
            expect(pollData.votingStatus).toBeDefined();
            expect(typeof pollData.votingStatus).toBe('string');
            expect(["CLOSED", "OPEN"].includes(pollData.votingStatus)).toBe(true);
            expect(pollData.options).toBeDefined();
            expect(Array.isArray(pollData.options)).toBe(true);
            pollData.options.forEach(option => {
                expect(option.optionID).toBeDefined();
                expect(typeof option.optionID).toBe('string');
                if (option.optionText) {
                    expect(option.optionText).toBeDefined();
                    expect(typeof option.optionText).toBe('object');
                    expect(option.pictureURL).toBeDefined();
                    expect(typeof option.pictureURL === 'string' || option.pictureURL === null).toBe(true);
                    expect(option.votes).toBeDefined();
                    expect(typeof option.votes).toBe('number');
                    expect(option.votesPercentage).toBeDefined();
                    expect(typeof option.votesPercentage).toBe('number');
                    expect(option.isChosen).toBeDefined();
                    expect(typeof option.isChosen).toBe('boolean');
                }
                if (option.tag) {
                    console.log(`Tag: ${JSON.stringify(option.tag)}`);
                    expect(option.tag).toBeDefined();
                    expect(typeof option.tag).toBe('object');
                    expect(option.tag.id).toBeDefined();
                    expect(typeof option.tag.id).toBe('string');
                    expect(option.tag.title).toBeDefined();
                    expect(typeof option.tag.title).toBe('object');
                    expect(option.tag.logo).toBeDefined();
                    expect(typeof option.tag.logo === 'object' || option.tag.logo === null).toBe(true);
                    if (option.tag.logo !== null) {
                        expect(option.tag.logo.url).toBeDefined();
                        expect(typeof option.tag.logo.url).toBe('string');
                    }
                    expect(option.tag.type).toBeDefined();
                    expect(typeof option.tag.type).toBe('string');
                }
                expect(option.votes).toBeDefined();
                expect(typeof option.votes).toBe('number');
                expect(option.votesPercentage).toBeDefined();
                expect(typeof option.votesPercentage).toBe('number');
                expect(option.isChosen).toBeDefined();
                expect(typeof option.isChosen).toBe('boolean');
            });
        }
    }
});

test('Check if getPollById query works ', async ({ request }, testInfo) => {
    for (let language of languages) {
        const pollListResponse = await request.post(apiURL, {
            data: {
                query: getPollsListQuery,
                variables: { lang: language }
            },
        });

        const pollListResponseBody = await pollListResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: pollListResponseBody
        });

        expect(pollListResponseBody.errors).toBeUndefined();
        const pollItems = pollListResponseBody?.data?.pollQueries?.feed?.items || [];
        expect(pollItems).toBeDefined();
        const pollID = pollItems[0]?.id;

        if (!pollID) {
            continue;
        } else {
            const pollResponse = await request.post(apiURL, {
                data: {
                    query: getPollById,
                    variables: { lang: language, pollHruOrId: pollID }
                },
            });
            const pollResponseBody = await pollResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: pollResponseBody
            });

            expect(pollResponseBody.errors).toBeUndefined();
            const pollData = pollResponseBody?.data?.pollQueries?.get;
            expect(pollData).toBeDefined();

        }
    }
});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
})