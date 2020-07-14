import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider, IKeyConditions, IQueryOptions } from '../page.provider';
import {equals} from '@aws/dynamodb-expressions';

export interface IQuery {
    getPages: object;
    getPage: object;
}

interface IGetPageById {
    id: string;
}

export const Query: IQuery = {
    getPages: async(_: any, args: { filter, status, options, orderBy }, context: any) => {

        let queryOptions: IQueryOptions = {};
        let keyCondition: IKeyConditions = {};


        if(args.status) {
            keyCondition.pageStatus = args.status;
        } else {
            keyCondition.pageStatus = '1';
        }

        if(args.filter) {
            queryOptions.filter = {
                ...equals(args.filter.parentPage),
                    subject: 'parentPage'
                }
        }

        if(args.options.startKey) {
            queryOptions.startKey = args.options.startKey;
        }

        if(args.options.limit) {
            queryOptions.limit = args.options.limit;
            //queryOptions.pageSize = args.options.limit;
        }

        if(args.orderBy) {
            if(args.orderBy.name) {
                queryOptions.indexName = 'PageStatusNameIndex';
                queryOptions.scanIndexForward = (args.orderBy.name === 'asc') ? true : false;
            } else if(args.orderBy.createdDate) {
                queryOptions.indexName = 'PageStatusCreatedDateIndex';
                queryOptions.scanIndexForward = (args.orderBy.createdDate === 'asc') ? true : false;
            }
        } else {
            queryOptions.indexName = 'PageStatusCreatedDateIndex';
            queryOptions.scanIndexForward = false;
        }


        console.log('args', args);
        console.log('keyCondition', keyCondition);
        console.log('queryOptions', queryOptions);

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        try {
            const result = await pageProvider.getPages(keyCondition, queryOptions);
            return { ...responseType.success, ...{ data: result } };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    },
    getPage: async (_: any, args: IGetPageById, context: any) => {
        const id = args.id;

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        try {
            const result = await pageProvider.getPage(id);
            return { ...responseType.success, ...{ data: result } };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    }
};
