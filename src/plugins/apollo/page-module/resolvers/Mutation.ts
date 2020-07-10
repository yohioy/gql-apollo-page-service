import { ModuleContext } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider } from '../page.provider';
import { v4 as uuid } from 'uuid';

interface IPageCreate {
    name: string;
    parentPage: string;
};

export interface IMutation {
    createPage: object
}

export const Mutation: IMutation = {
    createPage: async (_: any, args: IPageCreate, context: ModuleContext): Promise<any> => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        const pageData = {
            id: uuid(),
            parentPage: args.parentPage,
            name: args.name,
            strapLine: '',
            shortDescription: '',
            longDescription: '',
            seoFriendlyLinkId: '',
            seoFriendlyLink: '',
            customLink: '',
            templateType: '',
            menuLocation: '',
            relatedPages: '',
            pagePosition: '1',
            createdDate: Date.now(),
            modifiedDate: Date.now(),
            pageStatus: '1'
        };

        // Add user to Database
        try {
            await pageProvider.createPage(pageData);
            return responseType.success;
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

    }
};
