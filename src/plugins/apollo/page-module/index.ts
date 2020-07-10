import path from 'path';
import { gql } from 'apollo-server-hapi';
import { GraphQLModule } from '@graphql-modules/core';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import { UsersProvider, AccessProvider } from '@masteryo/masteryo-gql-core-providers';
import { PageProvider } from './page.provider';
import { isAuthorised } from '@masteryo/masteryo-gql-authorise';

const types = path.join(__dirname, './schema.graphql');

const typeDefs = importSchema(types);

export const PageModule = new GraphQLModule({
    name: 'page-module',
    resolvers,
    resolversComposition: {
        'Query.getPage': [],
        'Query.getPages': [],
        'Mutation.createPage': []
    },
    typeDefs: gql `
        ${typeDefs}
    `,
    providers: [UsersProvider, AccessProvider, PageProvider],
    context: session => session
});
