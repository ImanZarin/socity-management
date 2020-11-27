import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import { MyGraphql, myGraphqlSchema } from './graphql';
import { HouseService } from './houses/house.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { graphqlHTTP } = require('express-graphql');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('./cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const myGraphql = app.get(MyGraphql);
  app.use(cors.corsAll);
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
