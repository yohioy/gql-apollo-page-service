import {
    attribute,
    hashKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations';


@table('consultants')
export class ConsultantModel {

    @hashKey({
        type: "String"
    })
    id: string | undefined;

    @attribute()
    nameCharacter: string | undefined;

    @attribute()
    qualifications: string | undefined;

    @attribute()
    hospitals: string | undefined;

    @attribute()
    interests: string | undefined;

    @attribute()
    email: string | undefined;

    @attribute()
    website: string | undefined;

    @attribute()
    telephone: string | undefined;

}
