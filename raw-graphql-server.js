const express = require("express");
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require("graphql");

// import animal data
const animals = require("./assets/animals.json");

// creating a custom animal type
let animalType = new GraphQLObjectType({
  name: "Animal",
  fields: {
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    color: { type: GraphQLString }
  }
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      welcome_message: {
        type: GraphQLString,
        resolve() {
          return "Welcome to my new GraphQL endpoint";
        }
      },
      animal: {
        type: animalType,
        resolve() {
          return animals[0];
        }
      },
      animals: {
        type: GraphQLList(animalType),
        resolve() {
          return animals;
        }
      }
    }
  })
});

const app = express();
const PORT = process.env.PORT || 5000;

// Init Body Parser Middleware
app.use(express.json());

app.get("/", (req, res) => {
  let query =
    "{welcome_message, animal {name, description, color}, animals {name, color}}";
  graphql(schema, query).then(result => {
    console.log(result);
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
