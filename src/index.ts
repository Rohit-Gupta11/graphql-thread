import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { createGraphqlServer } from './graphql';
const PORT = Number(process.env.PORT) || 8000;

async function init() {
    const app = express();
    app.use(express.json());

    const gqlServer = await createGraphqlServer();
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.status(200).json({ message: 'hello world' });
    })

    app.listen(PORT, () => {
        console.log('Server is successfully running at PORT:', PORT);
    })
}

init();