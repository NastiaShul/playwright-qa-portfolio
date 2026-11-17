export const getPollsListQuery = `
query PollQueries ($lang: Language!) {
    pollQueries {
        feed(
            input: { status: PUBLISHED, language: $lang, pagination: { ByCursor: { first: 10 } } }
        ) {
            items {
                id
                pollID
            }
        }
    }
}`;

export const getPollByIdQuery = `
query getPollById( $lang: Language!, $pollID: ID!) {
    pollQueries {
        get(input: { contentIDOrHRU: $pollID }) {
            __typename
            id
            status
            isVoted
            totalVotes
            commentsCount
            votingStatus
            options {
                ... on CustomPollOption {
                    optionID
                    optionText {
                        defaultValue(language: $lang)
                        __typename
                    }
                    pictureURL
                    votes
                    votesPercentage
                    isChosen
                    __typename
                }
                ... on TagPollOption {
                    optionID
                    tag {
                        id
                        title {
                            defaultValue(language: $lang)
                            __typename
                        }
                        logo {
                            url
                            __typename
                        }
                        type
                        __typename
                    }
                    votes
                    votesPercentage
                    isChosen
                    __typename
                }
                __typename
            }
        }
        __typename
    }
}`;

export const getPollById = `fragment ShortPollFragment on CustomPoll {
    __typename
    id
    pollID
    status
    isVoted
    totalVotes
    commentsCount
    votingStatus
    url(input: { language: $language, useAvailableLang: true })
    options {
        ... on CustomPollOption {
            optionID
            optionText {
                defaultValue
            }
            pictureURL
            votes
            votesPercentage
            isChosen
        }
        ... on TagPollOption {
            optionID
            tag {
                id
                title {
                    defaultValue
                }
                logo {
                    url
                }
                type
            }
            votes
            votesPercentage
            isChosen
        }
    }
}
query getPollById($pollHruOrId: ID!, $language: Language) {
    pollQueries {
        get(input: { contentIDOrHRU: $pollHruOrId }) {
            ...ShortPollFragment
        }
    }
}
`;

export const getMatchPollQuery = `
query GetMatchPoll($matchId: ID!) {
    stat {
        football {
            stat_match(id: $matchId) {
                matchPoll {
                    __typename
                    ...MatchPollFragment
                }
            }
        }
    }
}
fragment MatchPollFragment on MatchPoll {
    status
    chosenOption
    pollResult {
        drawVotes
        awayTeamVotes
        homeTeamVotes
    }
}
    `;

export const getReactionForCommentsInPollQuery = `
query getReactionForCommentsInPoll($pollHruOrId: ID!) {
    pollQueries {
        get(input: { contentIDOrHRU: $pollHruOrId }) {
            pollID
            topLevelComments(input: { sort: BEST, pagination: { ByCursor: { first: 3 } } }) {
                items {
                    id
                    objectClass
                    reactions {
                        userReaction {
                            objectClass
                            objectID
                            reactionType
                            __typename
                        }
                        likeCount
                        dislikeCount
                        __typename
                    }
                    childThread(input: { sort: OLDEST, pagination: { ByCursor: { first: 3 } } }) {
                        items {
                            id
                            objectClass
                            reactions {
                                userReaction {
                                    objectClass
                                    objectID
                                    reactionType
                                    __typename
                                }
                                likeCount
                                dislikeCount
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                    __typename
                }
                paginationInfo {
                    ... on PaginationByCursor {
                        totalItemsCount
                        endCursor
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
        __typename
    }
}
`;

export const PostPollListQuery = `query PostPollList(
    $page: Int!
    $pageSize: Int!
    $sport: [SportID!]
    $tag: TagIDsInput
    $isMain: Boolean
    $mainInSection: Boolean
) {
    feedQueries {
        __typename
        feedPAL(
            input: {
                status: PUBLISHED
                sport: $sport
                newsLanguages: []
                tag: $tag
                pagination: { ByPage: { page: $page, pageSize: $pageSize } }
                main: $isMain
                mainInSection: $mainInSection
                contentTypes: [POLL, BLOGPOST]
            }
        ) {
            __typename
            items {
                __typename
                ... on Post {
                    ...PostPreviewCardFragment
                }
                ... on CustomPoll {
                    ...PollContentFragment
                }
            }
        }
    }
}
fragment LocalizedSBFragment on LocalizedSB {
    __typename
    defaultValue {
        __typename
        ...StructuredBodyFragment
    }
}
fragment LocalizedStringFragment on LocalizedString {
    __typename
    defaultValue
}
fragment ParagraphElement on BodyParagraphElement {
    __typename
    value {
        __typename
        ... on BodyText {
            text
            format {
                __typename
                bold
                italic
                color
            }
        }
        ... on BodyLink {
            href
            text
            format {
                __typename
                bold
                italic
                color
            }
        }
    }
    type
}
fragment PollAuthorFragment on Author {
    __typename
    alias
    user {
        __typename
        id
        name
    }
}
fragment PollContentFragment on CustomPoll {
    __typename
    id
    pollType
    endsAt
    votingStatus
    options {
        __typename
        ...PollContentOptionFragment
    }
    pollTitle: title {
        __typename
        ...LocalizedStringFragment
    }
    isVoted
    totalVotes
    structuredDescription {
        __typename
        ...LocalizedSBFragment
    }
    tags {
        __typename
        ...TagBubbleFragment
    }
    author {
        __typename
        ...PollAuthorFragment
    }
    displayAuthor {
        __typename
        ...PollAuthorFragment
    }
    publicationTime
    authPollType
    modifiedTime
    main
    mainSection
    commentsCount
    url(input: { useAvailableLang: true })
}
fragment PollContentOptionFragment on PollOption {
    __typename
    ... on CustomPollOption {
        optionID
        optionText {
            __typename
            ...LocalizedStringFragment
        }
        pictureURL
        votes
        votesPercentage
        isChosen
    }
    ... on TagPollOption {
        isChosen
        votesPercentage
        votes
        optionID
        tag {
            __typename
            ...TagInterfaceFragment
        }
    }
}
fragment PostPreviewCardAuthorFragment on Author {
    __typename
    hidden
    user {
        __typename
        id
        name
        avatar {
            __typename
            url
        }
        hasActiveSubscription
    }
}
fragment PostPreviewCardFragment on Post {
    __typename
    id
    title {
        __typename
        ...LocalizedStringFragment
    }
    mainPhoto {
        __typename
        url
        meta {
            __typename
            width
            height
        }
    }
    structuredDescription {
        __typename
        ...LocalizedSBFragment
    }
    publicationTime
    createdTime
    modifiedTime
    commentsCount
    label
    link
    reactions {
        __typename
        likeCount
        dislikeCount
        userReaction {
            __typename
            ...UserReactionFragment
        }
    }
    displayAuthor {
        __typename
        ...PostPreviewCardAuthorFragment
    }
    blog {
        __typename
        id
        title
    }
}
fragment StructuredBodyFragment on BodyTopElement {
    __typename
    type
    value {
        __typename
        ... on BodyParagraph {
            elements {
                __typename
                ...ParagraphElement
            }
        }
        ... on BodySubtitle {
            text
            level
            elements {
                __typename
                ...ParagraphElement
            }
        }
        ... on BodyImage {
            source
            width
            height
        }
        ... on BodyList {
            type
            style
            items {
                __typename
                elements {
                    __typename
                    ...ParagraphElement
                }
            }
        }
        ... on BodyIframe {
            source
        }
        ... on BodyInstagram {
            url
        }
        ... on BodyTwitter {
            id
        }
        ... on BodyLinkedImage {
            href
            image {
                __typename
                source
                width
                height
            }
        }
        ... on BodyYoutube {
            id
            start
        }
        ... on BodyAd {
            size
            platforms
            name
        }
    }
}
fragment TagBubbleFragment on Tag {
    __typename
    id
    type
    title {
        __typename
        ...LocalizedStringFragment
    }
    logo {
        __typename
        url
    }
}
fragment TagExtraFragment on TagExtra {
    __typename
    ... on TagTeamExtra {
        ...TagTeamExtraFragment
    }
    ... on TagTournamentExtra {
        ...TagTournamentExtraFragment
    }
    ... on TagPersonExtra {
        ...TagPersonExtraFragment
    }
    ... on TagOtherExtra {
        ...TagOtherExtraFragment
    }
}
fragment TagInterfaceFragment on Tag {
    __typename
    id
    type
    logo {
        __typename
        url
    }
    title {
        __typename
        ...LocalizedStringFragment
    }
    extra {
        __typename
        ...TagExtraFragment
    }
    statObject {
        __typename
        ...TagStatObjectFragment
    }
}
fragment TagOtherExtraFragment on TagOtherExtra {
    __typename
    interfaceTitle {
        __typename
        ...LocalizedStringFragment
    }
}
fragment TagPersonExtraFragment on TagPersonExtra {
    __typename
    firstName {
        __typename
        ...LocalizedStringFragment
    }
    lastName {
        __typename
        ...LocalizedStringFragment
    }
}
fragment TagStatObjectFragment on TagObjectValue {
    __typename
    ... on statPlayer {
        ...TagStatPlayerFragment
    }
    ... on statTeam {
        ...TagStatTeamFragment
    }
    ... on statTournament {
        ...TagStatTournamentFragment
    }
}
fragment TagStatPlayerFragment on statPlayer {
    __typename
    name
    firstName
    lastName
}
fragment TagStatTeamFragment on statTeam {
    __typename
    name
}
fragment TagStatTournamentFragment on statTournament {
    __typename
    name
}
fragment TagTeamExtraFragment on TagTeamExtra {
    __typename
    interfaceTitle {
        __typename
        ...LocalizedStringFragment
    }
}
fragment TagTournamentExtraFragment on TagTournamentExtra {
    __typename
    interfaceTitle {
        __typename
        ...LocalizedStringFragment
    }
}
fragment UserReactionFragment on Reaction {
    __typename
    reactionType
    objectID
    objectClass
}`;

export const PollById =
`query PollById($id: ID!) {
    pollQueries {
        __typename
        get(input: { contentIDOrHRU: $id }) {
            __typename
            ...PollContentDetailedFragment
        }
    }
}
fragment ChildThreadFragment on CommentsFeedPage {
    __typename
    items {
        __typename
        ...CommentFragment
    }
    paginationInfo {
        __typename
        ...PaginationInfoFragment
        ... on PaginationByCursor {
            totalItemsCount
        }
    }
}
fragment CommentFragment on Comment {
    __typename
    id
    threadId
    created
    application
    user {
        __typename
        ...UserFragment
    }
    parentComment {
        __typename
        ...ParentCommentFragment
    }
    text
    reactions {
        __typename
        likeCount
        dislikeCount
        userReaction {
            __typename
            ...UserReactionFragment
        }
    }
    isDeleted
    isReadByUser
    parentObject {
        __typename
        ...CommentParentObjectFragment
    }
}
fragment CommentParentObjectFragment on CommentParentObject {
    __typename
    ... on News {
        ...NewsEntityFragment
    }
    ... on Post {
        ...PostEntityFragment
    }
    ... on CustomPoll {
        ...PollEntityFragment
    }
}
fragment LocalizedSBFragment on LocalizedSB {
    __typename
    defaultValue {
        __typename
        ...StructuredBodyFragment
    }
}
fragment LocalizedStringFragment on LocalizedString {
    __typename
    defaultValue
}
fragment NewsEntityFragment on News {
    __typename
    id
    newsTitle: title {
        __typename
        ...LocalizedStringFragment
    }
}
fragment PaginationInfoCursor on PaginationByCursor {
    __typename
    endCursor
    startCursor
    hasNextPageCursor: hasNextPage
}
fragment PaginationInfoFragment on PaginationInfo {
    __typename
    ... on PaginationByPage {
        ...PaginationInfoPage
    }
    ... on PaginationByCursor {
        ...PaginationInfoCursor
    }
}
fragment PaginationInfoPage on PaginationByPage {
    __typename
    currentPage
    pageSize
    firstPage
    hasNextPage
}
fragment ParagraphElement on BodyParagraphElement {
    __typename
    value {
        __typename
        ... on BodyText {
            text
            format {
                __typename
                bold
                italic
                color
            }
        }
        ... on BodyLink {
            href
            text
            format {
                __typename
                bold
                italic
                color
            }
        }
    }
    type
}
fragment ParentCommentFragment on Comment {
    __typename
    id
    application
    threadId
    created
    user {
        __typename
        ...UserFragment
    }
    text
    reactions {
        __typename
        likeCount
        dislikeCount
        userReaction {
            __typename
            ...UserReactionFragment
        }
    }
    isDeleted
    parentObject {
        __typename
        ...CommentParentObjectFragment
    }
}
fragment PollAuthorFragment on Author {
    __typename
    alias
    user {
        __typename
        id
        name
    }
}
fragment PollContentDetailedFragment on CustomPoll {
    __typename
    ...PollContentFragment
    structuredBody {
        __typename
        ...LocalizedSBFragment
    }
    topLevelComments(input: { sort: BEST, pagination: { ByCursor: { first: 3 } } }) {
        __typename
        items {
            __typename
            ...RootCommentFragment
        }
        paginationInfo {
            __typename
            ...PaginationInfoFragment
        }
    }
}
fragment PollContentFragment on CustomPoll {
    __typename
    id
    pollType
    endsAt
    votingStatus
    options {
        __typename
        ...PollContentOptionFragment
    }
    pollTitle: title {
        __typename
        ...LocalizedStringFragment
    }
    isVoted
    totalVotes
    structuredDescription {
        __typename
        ...LocalizedSBFragment
    }
    tags {
        __typename
        ...TagBubbleFragment
    }
    author {
        __typename
        ...PollAuthorFragment
    }
    displayAuthor {
        __typename
        ...PollAuthorFragment
    }
    publicationTime
    authPollType
    modifiedTime
    main
    mainSection
    commentsCount
    url(input: { useAvailableLang: true })
}
fragment PollContentOptionFragment on PollOption {
    __typename
    ... on CustomPollOption {
        optionID
        optionText {
            __typename
            ...LocalizedStringFragment
        }
        pictureURL
        votes
        votesPercentage
        isChosen
    }
    ... on TagPollOption {
        isChosen
        votesPercentage
        votes
        optionID
        tag {
            __typename
            ...TagInterfaceFragment
        }
    }
}
fragment PollEntityFragment on CustomPoll {
    __typename
    id
    pollTitle: title {
        __typename
        ...LocalizedStringFragment
    }
}
fragment PostEntityFragment on Post {
    __typename
    id
    title {
        __typename
        ...LocalizedStringFragment
    }
}
fragment RootCommentFragment on Comment {
    __typename
    ...CommentFragment
    childThread(input: { pagination: { ByCursor: { first: 3 } }, sort: OLDEST }) {
        __typename
        ...ChildThreadFragment
    }
}
fragment StatPictureFragment on statPic {
    __typename
    main: resize(height: "160", width: "160")
}
fragment StructuredBodyFragment on BodyTopElement {
    __typename
    type
    value {
        __typename
        ... on BodyParagraph {
            elements {
                __typename
                ...ParagraphElement
            }
        }
        ... on BodySubtitle {
            text
            elements {
                __typename
                ...ParagraphElement
            }
        }
        ... on BodyImage {
            source
            width
            height
        }
        ... on BodyList {
            type
            style
            items {
                __typename
                elements {
                    __typename
                    ...ParagraphElement
                }
            }
        }
        ... on BodyIframe {
            source
        }
        ... on BodyInstagram {
            url
        }
        ... on BodyTwitter {
            id
        }
        ... on BodyLinkedImage {
            href
            image {
                __typename
                source
                width
                height
            }
        }
        ... on BodyYoutube {
            id
            start
        }
        ... on BodyAd {
            size
            platforms
            name
        }
    }
}
fragment TagBubbleFragment on Tag {
    __typename
    id
    type
    title {
        __typename
        ...LocalizedStringFragment
    }
    logo {
        __typename
        url
    }
}
fragment TagExtraFragment on TagExtra {
    __typename
    ... on TagTeamExtra {
        ...TagTeamExtraFragment
    }
    ... on TagTournamentExtra {
        ...TagTournamentExtraFragment
    }
    ... on TagPersonExtra {
        ...TagPersonExtraFragment
    }
    ... on TagOtherExtra {
        ...TagOtherExtraFragment
    }
}
fragment TagInterfaceFragment on Tag {
    __typename
    id
    type
    logo {
        __typename
        url
    }
    title {
        __typename
        ...LocalizedStringFragment
    }
    extra {
        __typename
        ...TagExtraFragment
    }
    statObject {
        __typename
        ...TagStatObjectFragment
    }
}
fragment TagOtherExtraFragment on TagOtherExtra {
    __typename
    interfaceTitle {
        __typename
        ...LocalizedStringFragment
    }
}
fragment TagPersonExtraFragment on TagPersonExtra {
    __typename
    firstName {
        __typename
        ...LocalizedStringFragment
    }
    lastName {
        __typename
        ...LocalizedStringFragment
    }
}
fragment TagStatObjectFragment on TagObjectValue {
    __typename
    ... on statPlayer {
        ...TagStatPlayerFragment
    }
    ... on statTeam {
        ...TagStatTeamFragment
    }
    ... on statTournament {
        ...TagStatTournamentFragment
    }
}
fragment TagStatPlayerFragment on statPlayer {
    __typename
    name
    firstName
    lastName
}
fragment TagStatTeamFragment on statTeam {
    __typename
    name
}
fragment TagStatTournamentFragment on statTournament {
    __typename
    name
}
fragment TagTeamExtraFragment on TagTeamExtra {
    __typename
    interfaceTitle {
        __typename
        ...LocalizedStringFragment
    }
}
fragment TagTournamentExtraFragment on TagTournamentExtra {
    __typename
    interfaceTitle {
        __typename
        ...LocalizedStringFragment
    }
}
fragment UserFragment on User {
    __typename
    id
    roles {
        __typename
        ID
    }
    name
    nickname
    hasActiveSubscription
    avatar {
        __typename
        url
        meta {
            __typename
            width
            height
        }
    }
    createTime
    daysRegistered
    bio
    currentAuthProvider
    rating {
        __typename
        rating
        position
    }
    location {
        __typename
        ...UserLocationFragment
    }
}
fragment UserLocationFragment on UserLocation {
    __typename
    country {
        __typename
        code
        name
        picture(productType: SPORTSAPP, format: SVG) {
            __typename
            ...StatPictureFragment
        }
    }
    city
}
fragment UserReactionFragment on Reaction {
    __typename
    reactionType
    objectID
    objectClass
}`;

export const GetPollTags = `query GetPollTags($id: ID!) {
    pollQueries {
        get(input: { contentIDOrHRU: $id }) {
            tags {
                id
            }
        }
    }
}
`