import { subscribeToTagMutation, unsubscriptionsMutations } from "../../apiRegression/apiSubscription/subscriptionMutations";
import { getMatchesByTeamId } from "../../apiRegression/apiStat/statQueries";
import { getFavMatchesByIDsQuery } from "../../apiRegression/apiSubscription/subscriptionQueries";
import { currentUserSubs } from "../../apiRegression/apiSubscription/subscriptionQueries";


export async function getCurrentSubs(request, apiURL, headers, testInfo) {
  const resp = await request.post(apiURL, {
    data: { query: currentUserSubs },
    headers,
  });
  const data = await resp.json();
  testInfo?.annotations?.push({ type: "response", description: data });
  return data?.data?.userSubscriptionsQueries?.currentUserSubs?.subscriptions || [];
}

export async function subscribeTag(request, apiURL, headers, tagId, testInfo) {
  const resp = await request.post(apiURL, {
    data: { query: subscribeToTagMutation, variables: { tagID: tagId } },
    headers,
  });
  const data = await resp.json();
  testInfo?.annotations?.push({ type: "subscribe", description: data });
  return data;
}

export async function unsubscribeTag(request, apiURL, headers, tagId, testInfo) {
  const resp = await request.post(apiURL, {
    data: { query: unsubscriptionsMutations, variables: { tagID: tagId } },
    headers,
  });
  const data = await resp.json();
  testInfo?.annotations?.push({ type: "unsubscribe", description: data });
  return data;
}

export async function getClubMatches(request, apiURL, headers, statTeamId) {
  const res = await request.post(apiURL, {
    headers,
    data: {
      query: getMatchesByTeamId,
      variables: { id: statTeamId },
    },
  });

  const json = await res.json();

  const matches =
    json.data.stat.football.stat_team.currentTournaments.flatMap(
      (t) => t.currentSeason.byTeam
    );

  return matches;
};

export async function getFavMatchesByIDs(request, apiURL, headers, matchIDs) {
  const res = await request.post(apiURL, {
    headers,
    data: {
      query: getFavMatchesByIDsQuery,
      variables: { matchIDs: matchIDs },
    },
  });

  return (await res.json()).data.userSubscriptionsQueries.getFavMatchesByIDs.ids;
}