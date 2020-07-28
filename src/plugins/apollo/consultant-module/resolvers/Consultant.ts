import { PageProvider } from "../../page-module/page.provider";

export const Consultant: any = {
    services: async (parent: any, args: any, context: any) => {
        //console.log('services', parent.services);
        let result: any = [];
        let data: any = {};

        const pageStatus = args.hasOwnProperty('status') ? args.status : null;
        const services = parent.services;

        if(services.length > 0) {
            for(let i=0; i < services.length; i++){
                data = await context.injector.get(PageProvider).getPage(services[i].id, pageStatus);
                if(data) {
                    result.push(data);
                }
            }
        }
        return result;
    },
    specialities: async (parent: any, args: any, context: any) => {

        let result: any = [];
        let data: any = {};

        const pageStatus = args.hasOwnProperty('status') ? args.status : null;
        const specialities = parent.specialities;

        if(specialities.length > 0) {
            for(let i=0; i < specialities.length; i++){
                data = await context.injector.get(PageProvider).getPage(specialities[i].id, pageStatus);
                if(data) {
                    result.push(data);
                }
            }
        }
        return result;
    },
}