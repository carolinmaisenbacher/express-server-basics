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






## Server side template rendering
I didn't implement a server for this use case, but you could use express-handlebars for it.
https://www.npmjs.com/package/express-handlebars
