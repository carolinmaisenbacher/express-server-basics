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


### Dynamic GraphQl endpoint - parsing query from request 
As you might have noticed, so far we always hardcoded the query strings. We didn't implement an actual graphql api server yet.

The graphql documentation expects the query string inside a JSON object, so I decided to go with that convention as well.
Here is how a request body, with Content-Type set to 'application/json' could look like:
`{"query": "{welcome_message animal(name: \"Mouse\") {name description}}"}`
(GraphQL, by convention, expects double quotes, so we need to escape those.)

To make this work, I needed to parse the json body and access the query attribute of the request body:
```
// Init Body Parser Middleware
app.use(express.json());

// graphql api endpoint, that parses query from req. body
app.get("/graphql", (req, res) => {
  let query = req.body.query;
  graphql({ schema, source: query, rootValue: root }).then(result => {
    res.json(result);
  });
});
```

You can now make a GET request to `http://localhost:5000/graphql/`. 
I used Postman to do it.
In the header, set Content-Type to "application/json"
In the body you can now post queries, e.g.:
This query will send you the welcome message and the animal with the name Mouse.
`{"query": "{welcome_message animal(name: \"Mouse\") {name description}}"}`
The repsonse looks like this
```
{
    "data": {
        "welcome_message": "Welcome to my new GraphQL endpoint",
        "animal": {
            "name": "Mouse",
            "description": "Tiny little animal, that likes cheese."
        }
    }
}
```

You can also try other querys:
* This will list all animals
`{"query": "{animals {name, color}}"`

* This query will add an Animal called "Horse"
`{"query": "mutation{addAnimal(animal: {name: \"Horse\", description: \"Wild with long legs and lots of hair\", color: \"Every color you can think of.\"})}"}`



#### This implementation still has a few caveats though:
* can't pass graphql directly
you always have to construct the json object and escape all characters etc.
* can't pass the query as a parameter to the get request
* no descriptive error messages
* no graphiql support yet
* mutations can be handled via get, which sounds insecure

You could implement all this, but there is a library that takes care of it already:
Express-GraphQL (https://github.com/graphql/express-graphql)


## Express GraphQL server
As we just said, our rough implementation of a graphql api server has still some missing pieces, but express-graphql is here to help.

It creates a GraphQL HTTP server for us, that automatically parses our requests, doesn't matter if we send the query as a url parameter, as json or as 'application/graphql'. 
Furthermore it takes care of error messages and gives us graphiql (the developer interface for your graphql queries), if we want to.

This how we declare the HTTP server:
```
const graphqlHTTP = require("express-graphql");

app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
```

### graphiql
As we set graphiql to `true`, when we initialized the server, we can access the interface under
`http://localhost:5000/graphql`

You can now write your querys in there, to test if they work.

The only tricky thing, in my opinion, is how to pass in parameters into a query, so I'll show it to you:

The way you write a mutation that adds an animal would be like this:
```
mutation MyMutation($name: String!, $description: String!, $color: String) {
  addAnimal(animal: {name: $name, description: $description, color: $color})
}
```
If you want to query for something and not do a mutation just swap out `mutation MyMutation`with `query <name_you_want_to_call_query>`

At the bottom, you pass in your query variables seperately
```
{
  "name": "Zebra", 
  "description": "striped horse", 
  "color": "black and white"
}
```


## Server side template rendering
I didn't implement a server for this use case, but you could use express-handlebars for it.
https://www.npmjs.com/package/express-handlebars
