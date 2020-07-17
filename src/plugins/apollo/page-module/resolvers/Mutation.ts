import { ModuleContext } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider, IPageInput } from '../page.provider';
import { v4 as uuid } from 'uuid';

export interface IMutation {
    createPage: object;
    updatePage: object;
}

export const Mutation: IMutation = {
    createPage: async (_: any, args: IPageInput, context: ModuleContext): Promise<any> => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        const pageData = {
            ...{
                id: uuid(),
                createdDate: Date.now(),
                modifiedDate: Date.now()
            },
            ...args
        };

        // Add page
        try {
            await pageProvider.createPage(pageData);
            return responseType.success;
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    },
    updatePage: async (_: any, args: IPageInput, context: ModuleContext): Promise<any> => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        const pageData = {
            ...args,
            ...{
                modifiedDate: Date.now()
            }
        };

        // update page
        try {
            await pageProvider.updatePage(pageData);
            return responseType.success;
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    }
};
