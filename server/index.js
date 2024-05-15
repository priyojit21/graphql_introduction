const express = require('express')

//importing axios for api calls
const { default: axios } = require("axios")

// setting up Apollo Server

const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')

const bodyParser = require('body-parser')
const cors = require('cors')

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        //define schemas

        //typedef is a string which contain schema, type user,todo is schema name (Todo,user api er moddhe total ki keys ache ota bolchi), ! means required field
        // combining 2 api wrt id or any other parameter(line 40), ps: parent ta ignore koro
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username : String!
                email : String!
                phone : String!
                website : String!
            }

            type Todo {
                id : ID!
                title : String!
                completed : Boolean
                user: User
            }

            type Query {
                getTodos : [Todo]
                getAllUsers : [User]
                getUser(id : ID!) : User
            }

        `
        ,
        resolvers: {
            //er bhetor logic likhi amra

            //2 api k merge korchi, todo r user, Todo theke user access korte chaile ei function call hbe (for nested query)
            Todo: {
                user: async(todo) =>
                    (
                        await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)
                    ).data,
            },
            //graphQL server theke kichu fetch korle tar query likhte hoi
            Query: {

                // user getTodo query korle ei getTodo function ta call hbe

                //api call kore ,data return korchi
                getTodos: async () =>
                    (await axios.get('https://jsonplaceholder.typicode.com/todos/')).data,
                getAllUsers: async () =>
                    (await axios.get('https://jsonplaceholder.typicode.com/users/')).data,
                getUser: async (parent,{id}) => 
                    (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            },
        },
    });

    //middlewares
    app.use(bodyParser.json());
    app.use(cors());

    //starting graphql server
    await server.start();

    //jodi kono req graphql endpoint a ashe tale seta expressMiddleware samlabe
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => {
        console.log("Server up and running");
    })
}

startServer();