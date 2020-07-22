import { responseType } from '@masteryo/masteryo-utils';
import { PageProvider } from '../page.provider';

export interface IQuery {
    getPages: object;
    getPage: object;
}

interface IGetPageById {
    id: string;
}

interface IGetPages {
    status: string;
    filter: object;
    options: object;
    orderBy: object;
}

//@todo: tidy this
export const Page: any = {
    relatedPages: async (parent: any, args: any, context: any) => {
        const pageProvider: PageProvider = context.injector.get(PageProvider);

        let result: any = [];
        for (const [key, value] of Object.entries(parent)) {
            if(key === 'relatedPages') {

                const relatedPages: any = value;
                // @ts-ignore
                for(let j = 0; j < relatedPages.length; j++){
                    const pageId = relatedPages[j].id;
                    const relatedPage = await pageProvider.getPage(pageId);
                    console.log(relatedPage);
                    result.push(relatedPage);
                }
            }
        }
        console.log(result);
        /*for await (const item of parent){

            console.log('relatedPages',item);
        }*/
        /*if(parent.relatedPages){
            const relatedPages = parent.relatedPages;
            console.log('relatedPages',parent);
            for(let i = 0; i < relatedPages.length; i++) {
                let id = relatedPages[i].id;
                const page = await pageProvider.getPage(id);

                result = { ...result, ...page };

            }
        }*/

        return result;
    }
};

export const Query: IQuery = {
    getPages: async(_: any, args: IGetPages, context: any) => {

        const pageProvider: PageProvider = context.injector.get(PageProvider);

        try {
            const result = await pageProvider.getPages(args);
            return { ...responseType.success, ...result };
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
