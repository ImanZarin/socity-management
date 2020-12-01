import { NestFactory } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { env } from 'process';
import { AppModule } from './app.module';
import { MyGraphql, myGraphqlSchema } from './graphql';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { graphqlHTTP } = require('express-graphql');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('./cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const myGraphql = app.get(MyGraphql);
  const loggingMiddleware = async (req, res, next) => {
    const token: string = req.headers.authorization;
    if (token) {
      const exactToken = token.substring(token.indexOf(' ') + 1);
      try {
        const { nationalNO, phone } = (await verify(
          exactToken,
          process.env.JWT_SECRET_KEY,
        )) as {
          nationalNO: string;
          phone: string;
        };
        console.log('id is: ', nationalNO);
        req.nationalNO = nationalNO;
        req.phone = phone;
      } catch (err) {
        console.log('Not recognised:', err);
        //throw new Error("not recognised");        
      }
    }
    req.next();
  };
  app.use(cors.corsAll);
  app.use(loggingMiddleware);
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: myGraphqlSchema,
      rootValue: myGraphql.myRootValue,
      graphiql: true,
    }),
  );
  await app.listen(env.BACKEND_PORT);
}
bootstrap();
