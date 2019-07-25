const express = require("express");
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");

// schema definition
let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    // graphql always needs one root query
    name: "RootQueryType",
    fields: {
      welcome_message: {
        type: GraphQLString,
        // The resolver defines what will be send back, once the field is queried
        resolve() {
          return "Welcome to my new GraphQL endpoint";
        }
      }
    }
  })
});

// init express server
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  // the query is hardcoded for now, we don't get it from the request
  let query = "{welcome_message}";
  graphql(schema, query).then(result => {
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
