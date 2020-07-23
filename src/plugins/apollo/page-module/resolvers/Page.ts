import { PageProvider } from '../page.provider';

export const Page: any = {
    relatedPages: async (parent: any, args: any, context: any) => {
        const pageProvider: PageProvider = context.injector.get(PageProvider);

        let result: any = [];
        for (const [key, value] of Object.entries(parent)) {
            if (key === 'relatedPages') {
                const relatedPages: any = value;

                for (let j = 0; j < relatedPages.length; j++) {
                    const pageId = relatedPages[j].id;
                    const relatedPage = await pageProvider.getPage(pageId);
                    result.push(relatedPage);
                }
            }
        }
        return result;
    }
};
