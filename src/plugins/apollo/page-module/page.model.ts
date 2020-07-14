import { DynamoDbSchema, DynamoDbTable } from '@aws/dynamodb-data-mapper';

export interface IPage {
  id: string | undefined;
  parentPage: string | undefined;
  name: string | undefined;
  strapLine?: string | undefined;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;
  seoFriendlyLinkId?: string | undefined;
  seoFriendlyLink?: string | undefined;
  customLink?: string | undefined;
  templateType?: string | undefined;
  menuLocation?: string | undefined;
  relatedPages?: string | undefined;
  pagePosition?: string | undefined;
  createdDate?: number | undefined;
  modifiedDate?: number | undefined;
  pageStatus?: string | undefined;
}

export class PageModel implements IPage {
  id;
  parentPage;
  name;
  strapLine;
  shortDescription;
  longDescription;
  seoFriendlyLinkId;
  seoFriendlyLink;
  customLink;
  templateType;
  menuLocation;
  relatedPages;
  pagePosition;
  createdDate;
  modifiedDate;
  pageStatus;
}

Object.defineProperties(PageModel.prototype, {
  [DynamoDbTable]: {
    value: 'pages'
  },
  [DynamoDbSchema]: {
    value: {
      id: {
        type: 'String',
        keyType: 'HASH'
      },
      createdDate: {
        type: 'Date',
        keyType: 'RANGE'
      },
      pageStatus: {
        type: 'String',
        indexKeyConfigurations: {
          PageStatusIndex: 'HASH'
        }
      },
      parentPage: {
        type: 'String',
        indexKeyConfigurations: {
          ParentPageIndex: 'HASH'
        }
      },
      name: { type: 'String' },
      strapLine: { type: 'String' },
      shortDescription: { type: 'String' },
      longDescription: { type: 'String' },
      seoFriendlyLinkId: { type: 'String' },
      seoFriendlyLink: { type: 'String' },
      customLink: { type: 'String' },
      templateType: { type: 'String' },
      menuLocation: { type: 'String' },
      relatedPages: { type: 'String' },
      pagePosition: { type: 'String' },
      modifiedDate: { type: 'Date' }
    }
  }
});

