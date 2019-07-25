const express = require("express");
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      welcome_message: {
        type: GraphQLString,
        resolve() {
          return "Welcome to my new GraphQL endpoint";
        }
      }
    }
  })
});

const app = express();
const PORT = process.env.PORT || 5000;

// the query is hardcoded for now
app.get("/", (req, res) => {
  let query = "{welcome_message}";
  graphql(schema, query).then(result => {
    console.log(result);
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
