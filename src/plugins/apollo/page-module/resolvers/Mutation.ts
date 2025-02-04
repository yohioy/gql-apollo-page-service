import { ModuleContext } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider, IPageInput } from '../page.provider';
import { v4 as uuid } from 'uuid';

export interface IMutation {
    createPage: object;
    updatePage: object;
}

export const Mutation: IMutation = {
    createPage: async (_: any, args: {data: IPageInput}, context: ModuleContext): Promise<any> => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        const pageData = {
            ...{
                id: uuid()
            },
            ...args.data,
            ...{
                createdDate: Date.now(),
                modifiedDate: Date.now()
            }
        };

        console.log(args.data);

        // Add page
        try {
            const result = await pageProvider.createPage(pageData);
            return {
                data: result,
                ...responseType.success
            };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    },
    updatePage: async (_: any, args: {id, data: IPageInput}, context: ModuleContext): Promise<any> => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        const pageData = {
            ...{
                id: args.id
            },
            ...args.data,
            ...{
                modifiedDate: Date.now()
            }
        };

        // update page
        try {
            const result = await pageProvider.updatePage(pageData);
            return {
                data: result,
                ...responseType.success
            };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    }
};
