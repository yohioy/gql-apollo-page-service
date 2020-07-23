import 'reflect-metadata';
import {ApolloServer, AuthenticationError} from 'apollo-server-hapi';
import { buildFederatedSchema } from '@apollo/federation';
import { Server } from '@hapi/hapi';
import { PageModule } from './page-module';
import { ConsultantModule } from './consultant-module';
import { dataMapper } from '@masteryo/masteryo-dynamodb-mapper';

const register = async (server: Server, options): Promise<void> => {

  let apolloServer = new ApolloServer({
    schema: buildFederatedSchema([PageModule]),
    context: async (session: { request }) => {

      const credentials = session.request.auth.credentials;

      if (!credentials) {
        throw new AuthenticationError('No Auth credentials');
      }

      // Add plugin options
      session.request.serverOptions = options;

      // Add Data mapper
      session.request.dataMapper = dataMapper({
        region: options.dbRegion,
        endpoint: options.dbEndpoint
      });

      return session;
    },
    formatError: (err) => {
      // Don't give the specific errors to the client.
      if (err) {
        console.log(err);
        return new Error('Internal server error');
      }

      return err;
    },
    introspection:true
  });

  // @ts-ignore
  await apolloServer.applyMiddleware({ app: server });

};

export const plugin = {
  name: 'apollo',
  register
}
