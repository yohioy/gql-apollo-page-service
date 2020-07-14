import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider, IPageListOptions } from '../page.provider';

export interface IQuery {
    getPages: object;
    getPage: object;
}

interface IGetPageById {
    id: string;
}

export const Query: IQuery = {
    getPages: async(_: any, args: { parentPage, status, startKey, limit, orderBy }, context: any) => {

        let options: IPageListOptions = {};
        let keyCondition: { parentPage: String } = {} as any;

        options.indexName = 'ParentPageIndex';

        if(args.parentPage) {
            keyCondition.parentPage = args.parentPage;
        }
        if(args.status) {
            options.status = args.status;
        }
        if(args.startKey) {
            options.startKey = args.startKey;
        }
        if(args.limit) {
            options.limit = args.limit;
            options.pageSize = args.limit;
        }
        if(args.orderBy) {
            options.orderBy = args.orderBy;
        }
        options.scanIndexForward = (args.orderBy === 'asc') ? true : false;

        console.log(options);

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        try {
            const result = await pageProvider.getPages(keyCondition, options);
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
