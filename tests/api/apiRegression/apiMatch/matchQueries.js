export const matchesUpcomingQuery = `
query Stat_matchesUpcoming {
    stat_matchesUpcoming(limit: 5) {
        matches {
            id
        }
    }
}
`;

export const getMatchesQuery = `
  query UpcomingAndPastMatches($teamId: ID!) {
    stat {
      football {
        stat_team(id: $teamId) {
          teaser(last: 3, next: 3) {
            current { 
              id
              status
              matchStatus
              scheduledAt
              home {
                team {
                  name
                }
              }
              away {
                team {
                  name
                }
              }
            }
            next {
              id
              home {
                team {
                  name
                }
              }
              away {
                team {
                  name
                }
              }
              scheduledAt
              matchStatus
            }
            last {
              id
              status
              scheduledAt
              scheduledAtStamp
              home {
                team {
                  id
                  name
                }
              }
              away {
                team {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
