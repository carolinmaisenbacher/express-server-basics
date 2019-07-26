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


    input AnimalInput {
        name: String!
        description: String!,
        color: String
    }
    type Mutation {
        addAnimal(animal: AnimalInput!): String
    }
`);

// when using buildSchema, you need to define the resolver seperately
let root = {
  welcome_message: () => "Welcome to my new GraphQL endpoint",
  // parameterized resolver
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

app.get("/", (req, res) => {
  // this is how you pass a parameter to a function
  let query = `{welcome_message animal(name: "Mouse") {name description} animals {name, color}}`;
  graphql({ schema, source: query, rootValue: root }).then(result => {
    res.json(result);
  });
});

// this endpoint normally wouldn't exist. Graphql will always be handled within one endpoint.
// Here we do it differently
app.get("/addAnimal", (req, res) => {
  // this is how you write a mutation query
  let query = `mutation{addAnimal(animal: {name: "Horse", description: "Wild with long legs and lots of hair", color: "Every color you can think of."})}`;
  graphql({ schema, source: query, rootValue: root }).then(result => {
    res.json(result);
  });
});

// Init Body Parser Middleware
app.use(express.json());

// graphql api endpoint, that parses query from req. body
app.get("/graphql", (req, res) => {
  let query = req.body.query;
  graphql({ schema, source: query, rootValue: root }).then(result => {
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
