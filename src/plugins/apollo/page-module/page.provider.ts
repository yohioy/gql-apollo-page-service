import { ModuleSessionInfo} from '@graphql-modules/core';
import { Injectable } from '@graphql-modules/di';
import { PageModel, IPage } from './page.model';
import {equals} from '@aws/dynamodb-expressions';

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

  getPagesParams(args) {

    let queryOptions: IQueryOptions = {};
    let keyCondition: IKeyConditions = {};


    if(args.status) {
      keyCondition.pageStatus = args.status;
    } else {
      keyCondition.pageStatus = '1';
    }

    if(args.filter) {
      queryOptions.filter = {
        ...equals(args.filter.parentPage),
        subject: 'parentPage'
      }
    }

    if(args.options.startKey) {
      queryOptions.startKey = args.options.startKey;
    }

    if(args.options.limit) {
      queryOptions.limit = args.options.limit;
      //queryOptions.pageSize = args.options.limit;
    }

    if(args.orderBy) {
      if(args.orderBy.name) {
        queryOptions.indexName = 'PageStatusNameIndex';
        queryOptions.scanIndexForward = (args.orderBy.name === 'asc') ? true : false;
      } else if(args.orderBy.createdDate) {
        queryOptions.indexName = 'PageStatusCreatedDateIndex';
        queryOptions.scanIndexForward = (args.orderBy.createdDate === 'asc') ? true : false;
      }
    } else {
      queryOptions.indexName = 'PageStatusCreatedDateIndex';
      queryOptions.scanIndexForward = false;
    }

    return {
      keyCondition: keyCondition,
      queryOptions: queryOptions
    }
  }


  async getPages (args) {

    const { keyCondition, queryOptions } = this.getPagesParams(args);

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
