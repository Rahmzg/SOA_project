//define GraphQL schema using the GraphQL schema language
const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Manga {
    id: String!
    title: String!
    description: String!
  }

  type Anime {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    manga(id: String!): Manga
    manga: [Manga]
    anime(id: String!): Anime
    anime: [Anime]
  }
  type Mutation {
    createManga(id: String!, title: String!, description:String!): Manga
  }
`;

//The Query type defines the availabl
//The Mutation type defines the available mutations for creating manga

module.exports = typeDefs