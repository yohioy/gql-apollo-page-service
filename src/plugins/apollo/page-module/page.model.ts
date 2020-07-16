import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

@table('pages')
export class PageModel {

  @hashKey({
    type: "String"
  })
  id: string | undefined;

  @rangeKey({
    type: "Number"
  })
  createdDate: number | undefined;

  @attribute()
  name: string | undefined;

  @attribute()
  parentPage: string | undefined;

  @attribute()
  strapLine: string | undefined;

  @attribute()
  shortDescription: string | undefined;

  @attribute()
  longDescription: string | undefined;

  @attribute()
  seoFriendlyLinkId: string | undefined;

  @attribute()
  customLink: string | undefined;

  @attribute()
  metaTitle: string | undefined;

  @attribute()
  metaDescription: string | undefined;

  @attribute()
  metaKeywords: string | undefined;

  @attribute()
  featuredImage: string | undefined;

  @attribute()
  templateType: string | undefined;

  @attribute()
  menuLocation: string | undefined;

  @attribute()
  relatedPages: string | undefined;

  @attribute()
  pagePosition: string | undefined;

  @attribute()
  modifiedDate: number | undefined;

  @attribute()
  expiryDate: number | undefined;

  @attribute()
  pageStatus: string | undefined;
}