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
# Simple Server
Most simple static express server. 

It has two routes.
On `http://localhost:5000`it returns a h1 "hello world". 
Because we send it with the `send`function of express, the Content-Type header will be set automatically, so the browser knows it is html.

On `http://localhost:5000/static/`it returns the static index.html file.



# Server side template rendering
I didn't implement a server for this use case, but you could use express-handlebars for it.
