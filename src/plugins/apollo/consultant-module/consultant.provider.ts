import {Injectable} from '@graphql-modules/di';
import {ModuleSessionInfo} from '@graphql-modules/core';
import { ConsultantModel } from './consultant.model';

export interface IConsultantInput {
    id: string;
    nameCharacters: string;
    qualifications: string;
    interests: string;
    hospitals: string;
    website: string;
    email: string;
    telephone: string;
}


@Injectable()
export class ConsultantProvider {
    public mapper;

    constructor (private moduleSessionInfo: ModuleSessionInfo) {
        this.mapper = moduleSessionInfo.session.request.dataMapper;
    }

    async createConsultant (data: IConsultantInput): Promise<any> {

        const consultant = new ConsultantModel();

        for (const [key, value] of Object.entries(data)) {
            consultant[key] = value;
        }

        return this.mapper.put(consultant);
    }


    async updateConsultant (data: IConsultantInput): Promise<any> {
        const id = data.id;
        let page = await this.getConsultant(id);

        for (const [key, value] of Object.entries(data)) {
            page[key] = value;
        }

        return this.mapper.update(page);
    }


    async getConsultant (id: string): Promise<any> {
        const consultant = new ConsultantModel();
        consultant.id = id;
        return this.mapper.get(consultant);
    }

}
