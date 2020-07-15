import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider } from '../page.provider';

export interface IQuery {
    getPages: object;
    getPage: object;
}

interface IGetPageById {
    id: string;
}

export const Query: IQuery = {
    getPages: async(_: any, args: { filter, status, options, orderBy }, context: any) => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        try {
            const result = await pageProvider.getPages(args);
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
