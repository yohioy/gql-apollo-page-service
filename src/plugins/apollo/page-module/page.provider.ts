import { ModuleSessionInfo} from '@graphql-modules/core';
import { Injectable } from '@graphql-modules/di';
import { PageModel, IPage } from './page.model';

export interface IPageListOptions {
  indexName?: string;
  status?: string;
  limit?: number;
  pageSize?: number;
  startKey?: string;
  orderBy?: string;
  scanIndexForward?: boolean;
}

export interface IKeyConditions {
  parentPage?: string;
  pageStatus?: string;
}
export interface IQueryOptions {
  filter?: object;
  startKey?: string;
  limit?: string;
  pageSize?: string;
  indexName?: string;
  scanIndexForward?: boolean;
}

@Injectable()
export class PageProvider {
  public mapper;

  constructor(private moduleSessionInfo: ModuleSessionInfo) {
    this.mapper = moduleSessionInfo.session.request.dataMapper;
  }

  async createPage (data: IPage): Promise<any> {

    const page = new PageModel();
    page.id = data.id;
    page.parentPage = data.parentPage;
    page.name = data.name;
    page.pagePosition = data.pagePosition;
    page.pageStatus = data.pageStatus;
    page.createdDate = data.createdDate;
    page.modifiedDate = data.modifiedDate;

    return this.mapper.put(page);
  }

  async getPage (type: string) {
    const group = new PageModel();
    return this.mapper.get(group);
  }

  async getPages (keyCondition: IKeyConditions, queryOptions: IQueryOptions) {

    const iterator = this.mapper.query(
        PageModel,
        keyCondition,
        queryOptions
    );

    const paginator = this.mapper.query(
        PageModel,
        keyCondition,
        queryOptions
    ).pages();

    const data: any = [];

    //@todo do pagination

    for await (const page of paginator) {
      console.log(
          paginator.count,
          paginator.scannedCount,
          paginator.lastEvaluatedKey
      );
    }

    console.log(paginator);

    for await (const record of iterator) {
      data.push(record);
    }
    return data;
  }

}
