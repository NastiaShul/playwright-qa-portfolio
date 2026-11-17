export const getMatchesByTeamId = `
    query GetMatches($id: ID!) {
      stat {
        football {
          stat_team(id: $id) {
            currentTournaments {
              currentSeason {
                byTeam: matches(idTeam: $id) {
                  id
                  scheduledAt
                }
              }
            }
          }
        }
      }
    }
  `;
