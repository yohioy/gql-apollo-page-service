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

export interface IMutation {
    createConsultant: object;
}

export interface IPage {
    consultantInfo: object;
}

export interface IConsultantProvider {
    mapper: object;
    createConsultant (data: IConsultantInput): Promise<any>;
    updateConsultant (data: IConsultantInput): Promise<any>;
    getConsultant (id: string): Promise<any>;
}
