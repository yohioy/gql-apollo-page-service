import { ModuleSessionInfo} from '@graphql-modules/core';
import { Injectable } from '@graphql-modules/di';
import { PageModel } from './page.model';
import { equals, ConditionExpression } from '@aws/dynamodb-expressions';

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



  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }



  async getPage (id: string, pageStatus?: string | null) {

    const keyCondition = {
      id: id,
    };

    let filterCondition = {};
    let queryOptions = { limit: 1 };

    if(pageStatus) {
      filterCondition = {
        ...equals(String(pageStatus)),
        subject: 'pageStatus'
      };
    }

    if(!this.isEmpty(filterCondition)) {
      queryOptions = {
        ...queryOptions,
        ... { filter: filterCondition }
      };
    }

    const iterator = this.mapper.query(PageModel, keyCondition, queryOptions);

    let result;

    for await (const record of iterator) {
      result = record;
    }
    return result;
  }


  getPagesParams(args) {

    let queryOptions: IQueryOptions = {};
    let keyCondition: IKeyConditions = {};


    if(args.options.limit) {
      queryOptions.limit = args.options.limit;
    }
    queryOptions.indexName = 'PageStatusCreatedDateIndex';
    queryOptions.scanIndexForward = false;

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


    if(args.orderBy) {
      if(args.orderBy.name) {
        queryOptions.indexName = 'PageStatusNameIndex';
        queryOptions.scanIndexForward = (args.orderBy.name === 'asc') ? true : false;
      } else if(args.orderBy.createdDate) {
        queryOptions.indexName = 'PageStatusCreatedDateIndex';
        queryOptions.scanIndexForward = (args.orderBy.createdDate === 'asc') ? true : false;
      }
    }

    return {
      keyCondition: keyCondition,
      queryOptions: queryOptions
    }
  }


  async getPages (args) {

    const { keyCondition, queryOptions } = this.getPagesParams(args);

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
