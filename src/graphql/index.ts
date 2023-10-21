import { ApolloServer } from '@apollo/server';
import { User } from './user/index';

export async function createGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                ${User.Queries}
            }
            type Mutation {
               ${User.Mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        },
    });

    await gqlServer.start();
    return gqlServer;
}