import { ModuleSessionInfo} from '@graphql-modules/core';
import { Injectable } from '@graphql-modules/di';
import { PageModel } from './page.model';
import {equals,ConditionExpression} from '@aws/dynamodb-expressions';

export interface IPageInput {
  id: string;
  name: string;
  parentPage: string;
  pagePosition: string;
  pageStatus: string;
  images: object;
  relatedPages: object;
  template: string;
  createdDate: number;
  modifiedDate: number;
}

export interface IKeyConditions {
  pageStatus?: string;
}

export interface IQueryOptions {
  filter?: object;
  startKey?: object;
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

  async createPage (data: IPageInput): Promise<any> {

    const page = new PageModel();

    for (const [key, value] of Object.entries(data)) {
      page[key] = value;
    }

    return this.mapper.put(page);
  }

  async updatePage (data: IPageInput): Promise<any> {
    const id = data.id;
    let page = await this.getPage(id);

    for (const [key, value] of Object.entries(data)) {
      page[key] = value;
    }

    return this.mapper.update(page);
  }


  async getPage (id: string) {
    const page = new PageModel();
    page.id = id;
    return this.mapper.get(page);
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
      let filterListExpression: any = [];
      for(let filterName in args.filter) {
        console.log('filter', args.filter[filterName]);

        const filterCondition = {
          ...equals(args.filter[filterName]),
          subject: filterName
        };

        filterListExpression.push(filterCondition);
      }

      let andExpression: ConditionExpression;

      if(filterListExpression.length > 0) {
        andExpression = {
          type: 'And',
          conditions: filterListExpression
        };
      } else {
        andExpression = filterListExpression;
      }
      queryOptions.filter = andExpression;
    }


    if(args.options.startKey) {
      queryOptions.startKey = {
        ...args.options.startKey,
        ...keyCondition
      };

    }

    if(args.options.limit) {
      queryOptions.limit = args.options.limit;
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

    //console.log('getpages log', PageModel, keyCondition,queryOptions);

    const paginator = this.mapper.query(
        PageModel,
        keyCondition,
        queryOptions
    ).pages();

    let data: any = [];
    let pagination: any = {};

    for await (const page of paginator) {

      for await (const pageItem of page) {
        data.push(pageItem);
      }

      pagination = {
        count: paginator.count,
        scannedCount: paginator.scannedCount,
        lastEvaluatedKey: paginator.lastEvaluatedKey
      }
    }

    return {
      data: data,
      pagination: pagination
    }

  }



}
