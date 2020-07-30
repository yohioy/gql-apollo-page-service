import { ModuleContext } from '@graphql-modules/core';
import { ConsultantProvider } from '../consultant.provider';
import { IPage } from '../interfaces';

export const Page: IPage = {
    consultantInfo: async (parent: { id }, args: any, context: ModuleContext): Promise<object> => {
        const result = await context.injector.get(ConsultantProvider).getConsultant(parent.id);
        return result;
    }
}
