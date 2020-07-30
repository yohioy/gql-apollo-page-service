import { ModuleContext } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { IConsultantInput, IMutation, IResponse } from '../interfaces';
import { ConsultantProvider } from '../consultant.provider';

export const Mutation: IMutation = {
    createConsultant: async (parent: any, args: {data: IConsultantInput}, context: ModuleContext): Promise<IResponse> => {

        const consultantProvider: ConsultantProvider = context.injector.get(ConsultantProvider);

        const consultantData = args.data;

        console.log(consultantData);

        try {
            const result = await consultantProvider.createConsultant(consultantData);
            return {
                data: result,
                ...responseType.success
            };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    }
}
