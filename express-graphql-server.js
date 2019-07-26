const express = require("express");
const graphqlHTTP = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

// import animal data
const animals = require("./assets/animals.json");

// the buildSchema function creates a GraphQLSchema, but with a cleaner synax
// custom type Animal ges are defined inside
let schema = buildSchema(`
    type Animal {
        name: String,
        description: String,
        color: String,
    },
    type Query {
        welcome_message: String,
        animal(name: String!): Animal,
        animals: [Animal]
    }


    input AnimalInput {
        name: String!
        description: String!,
        color: String
    }
    type Mutation {
        addAnimal(animal: AnimalInput!): String
    }
`);

let root = {
  welcome_message: () => "Welcome to my new GraphQL endpoint",
  // parameteried resolver
  animal: ({ name }) =>
    animals.filter(animal => {
      return animal.name === name;
    })[0],
  animals: () => animals,
  addAnimal: ({ animal }) => {
    // this is a very simplistic implementation, usually you should at least check so no items are duplicated
    animals.push(animal);
    return "success";
  }
};

// Init express server
const app = express();
const PORT = process.env.PORT || 5000;

// no more need to source, because the webserver will parse the query from the request automatically
app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
