import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { prismaClient } from './lib/db';
const PORT = Number(process.env.PORT) || 8000;

async function init() {
    const app = express();
    app.use(express.json());

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'this is working well',
                say: (_, { name }: { name: string }) => `Hey ${name}, how are you doing?`
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: { firstName, lastName, email, password, salt: 'random_salt'}
                    });
                    return true;
                }
            }
        },
    });

    await gqlServer.start();
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.status(200).json({ message: 'hello world' });
    })

    app.listen(PORT, () => {
        console.log('Server is successfully running at PORT:', PORT);
    })
}

init();