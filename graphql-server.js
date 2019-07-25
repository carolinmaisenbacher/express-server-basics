const express = require("express");
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
`);

// when using buildSchema, you need to define the resolver seperately
let root = {
  welcome_message: () => "Welcome to my new GraphQL endpoint",
  // parameterized resolver
  animal: ({ name }) =>
    animals.filter(animal => {
      console.log(name);
      console.log(animal.name === name);
      return animal.name === name;
    })[0],
  animals: () => animals
};

// Init express server
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  // this is how you pass a parameter to a function
  let query = `{welcome_message animal(name: "Mouse") {name description} animals {name, color}}`;
  graphql({ schema, source: query, rootValue: root }).then(result => {
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
