import { test, expect } from '@playwright/test';
import { matchesUpcomingQuery } from "../apiMatch/matchQueries";
import { getMatchPollQuery } from "./pollQueries";

const apiURL = process.env.API_URL;

test('Check if GetMatchPoll query works', async ({ request }, testInfo) => {
    const matchesResponse = await request.post(apiURL, {
        data: {
            query: matchesUpcomingQuery,
        },
    });

    const matchesData = await matchesResponse.json();
    testInfo.annotations.push({
        type: 'response',
        description: matchesResponse
    });
    const matches = matchesData?.data?.stat_matchesUpcoming?.matches || [];
    expect(matches).toBeDefined();
    expect(Array.isArray(matches)).toBe(true);

    const matchID = matches[0].id;

    const matchPollResponse = await request.post(apiURL, {
        data: {
            query: getMatchPollQuery,
            variables: { matchId: matchID },
        },
    });

    const matchPollData = await matchPollResponse.json();

    testInfo.annotations.push({
        type: 'response',
        description: matchPollData
    });

    expect(matchPollData.errors).toBeUndefined();

    const matchPoll = matchPollData?.data?.stat?.football?.stat_match?.matchPoll;
    expect(matchPoll).toBeDefined();
    expect(typeof matchPoll).toBe('object');
    expect(matchPoll.status).toBeDefined();
    expect(["CLOSED", "OPEN", "AVAILABLE", "NOT_STARTED"].includes(matchPoll.status)).toBe(true);
    expect(matchPoll.chosenOption).toBeDefined();
    expect(typeof matchPoll.chosenOption).toBe('object');
    expect(matchPoll.pollResult).toBeDefined();
    expect(typeof matchPoll.pollResult === 'object' || matchPoll.pollResult === null).toBe(true);

    if (matchPoll.pollResult !== null) {
        expect(typeof matchPoll.pollResult).toBe('object');
        expect(matchPoll.pollResult.drawVotes).toBeDefined();
        expect(typeof matchPoll.pollResult.drawVotes).toBe('number');
        expect(matchPoll.pollResult.awayTeamVotes).toBeDefined();
        expect(typeof matchPoll.pollResult.awayTeamVotes).toBe('number');
        expect(matchPoll.pollResult.homeTeamVotes).toBeDefined();
        expect(typeof matchPoll.pollResult.homeTeamVotes).toBe('number');
    }
});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});