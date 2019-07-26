const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const animals = require("./assets/animals.json");

const app = express();
const PORT = process.env.PORT || 5000;

const schema = gql`
  type Query {
    welcome_message: String
    animal(name: String!): Animal
    animals: [Animal]
  }
  type Animal {
    name: String
    description: String
    color: String
  }
  input AnimalInput {
    name: String!
    description: String!
    color: String
  }
  type Mutation {
    addAnimal(animal: AnimalInput!): String
  }
`;
const resolvers = {
  Query: {
    welcome_message: () => "Welcome to my first apollo server",
    animal: name => animals[0],
    animals: () => animals
  },
  Mutation: {
    addAnimal: (_, { animal }) => {
      console.log(animal);
      return "success";
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: "/" });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
