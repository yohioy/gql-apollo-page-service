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

export interface IConsultant {
    services: object;
    specialities: object;
}

export interface IResponse {
    data?: object,
    code: number,
    message: string
}

export interface IConsultantProvider {
    mapper: object;
    createConsultant (data: IConsultantInput): Promise<object>;
    updateConsultant (data: IConsultantInput): Promise<object>;
    getConsultant (id: string): Promise<object>;
}
