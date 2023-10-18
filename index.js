import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} from "graphql";
import fetch from "node-fetch";
import cors from "cors";

// ...

// Define a GraphQL type for users
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    content: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    following: { type: GraphQLString },
  },
});

// Create a Query type
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        // Fetch data from the external URL
        const response = await fetch(
          "https://jsonserver-mm0q.onrender.com/api/users"
        );
        const data = await response.json();
        return data;
      },
    },
  },
});

// Create the GraphQL schema
const schema = new GraphQLSchema({
  query: QueryType,
});

// Create an Express server
const app = express();
// Use the CORS middleware
app.use(cors());

// Set up the GraphQL endpoint
app.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true, // Enable the GraphQL IDE for testing
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL server is running on http://localhost:${PORT}/`);
});
