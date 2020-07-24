
import { ConsultantProvider } from '../consultant.provider';

export const Page: any = {
    consultantInfo: async (parent: any, args: any, context: any) => {
        console.log('parent', parent);
        const result = await context.injector.get(ConsultantProvider).getConsultant(parent.id);
        return result;
    }
}
