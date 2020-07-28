import path from 'path';
import { gql } from 'apollo-server-hapi';
import { GraphQLModule } from '@graphql-modules/core';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import { UsersProvider, AccessProvider } from '@masteryo/masteryo-gql-core-providers';
import { ConsultantProvider } from './consultant.provider';
import {PageProvider} from "../page-module/page.provider";
import { isAuthorised } from '@masteryo/masteryo-gql-authorise';

const types = path.join(__dirname, './schema.graphql');

//@todo - test this module
const typeDefs = importSchema(types);

export const ConsultantModule = new GraphQLModule({
    name: 'consultant-module',
    resolvers,
    resolversComposition: {
        'Query.getConsultant': [],
        'Query.getConsultants': [],
        'Mutation.createConsultant': []
    },
    typeDefs: gql `
        ${typeDefs}
    `,
    providers: [UsersProvider, AccessProvider, ConsultantProvider, PageProvider],
    context: session => session
});
