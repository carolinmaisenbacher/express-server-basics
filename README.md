# express-server-basics
An evolution of express servers exposing an api, with REST and later with GraphQL.

## Running the examples
1. Clone the Repository
2. `yarn install` (In case you don't have yarn yet, you need to install it with homebrew first)
3. now you can run any example with
`node <name_of_server_example_file>`

for development purposes I also included the /nodemon/ dependency. It watches a file and restarts the server whenever you update your code.
You run it with
`nodemon <name_of_server_example_file>`


# Explanation of the examples in a logical order
## Simple Server
Most simple static express server. 

It has two routes.
On `http://localhost:5000`it returns a h1 "hello world". 
Because we send it with the `send`function of express, the Content-Type header will be set automatically, so the browser knows it is html.

On `http://localhost:5000/static/`it returns the static index.html file.


## Simple Raw GraphQL Server
Most simple graphql server that uses the raw graphql functions of `GraphQLObjectType`, `GraphQLString`and a few more, to define the schema.


It only exposes one field: `welcome_message`.

When you hit `http://localhost:5000`it will return "Welcome to my new GraphQL endpoint". 
That happens, because in the express route "/" we hardcoded the query: `{welcome_message}`. 
GraphQL resolves this query and we send back the result.

Here, we can already see the power of GraphQL. Just by giving it the schema and the query it knows what to do. It calls the correct resolvers etc. and gives us back a result that we can immediatly sent back. No need for serialization like in a REST api.


## Raw GraphQL Server

This one also leverages the raw graphql functions. 
Furthermore it creates a custom type animal and exposes a `animal` and an `animals` endpoint.


## GraphQL Server

For this server implementation we said goodbye to the low level functions of graphql and make use of the `buildSchema()`function that graphql exposes.

It lets us create a schema with a much simpler syntax.

Instead of 
```
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

// this is how you define the graphql endpoint inside an express route
graphql(schema, query).then(result => {
    res.json(result);
  });
```

You know write it in a more explicit syntax.
However, you now need to define the schema and the resolver seperately.
```
let schema = buildSchema(`
    type Query {
        welcome_message: String
    }
`);

let root = {
  welcome_message: () => "Welcome to my new GraphQL endpoint",
};

// this is how you define the graphql endpoint inside an express route
  graphql({ schema, source: query, rootValue: root }).then(result => {
    res.json(result);
  });
```

The code of the graphql server contains also how to define a custom type, how to pass a parameter into a schema, etc.
The server is the exact codebase, as the raw graphql server, simple rewritten. So go ahead and compare those too, to really see the amount of boilerplate code it saves us. 

### Mutation
There is just one thing added in the Code. A mutation endpoint to add one animal.
```
let schema = buildSchema(`
    type Query {…}

    input AnimalInput {
        name: String!
        description: String!,
        color: String
    }
    type Mutation {
        // this adds a mutation method addAnimal, that takes an animal as a parameter and gives back string
        addAnimal(animal: AnimalInput!): String
    }
`);

et root = {
  addAnimal: ({ animal }) => {
    // this is a very simplistic implementation, usually you should check that no items are duplicated, etc...
    animals.push(animal);
    return "success";
  }
};
```

a query to call this mutation would look like this:
```
let query = `mutation{
  addAnimal(animal:  { 
     name: "Horse", 
     description: "Wild with long legs and lots of hair", 
     color: "Every color you can think of."
     })
}`;
```

To show that the mutation works, I added a second route `localhost:5000/addAnimal/`, that will call exactly that query. 
So after you hit this endpoint go back to `localhost:5000/`and you will see that the Animal "Horse" got added to the list of animals.


## Server side template rendering
I didn't implement a server for this use case, but you could use express-handlebars for it.
https://www.npmjs.com/package/express-handlebars
