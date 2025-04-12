export * from './channel';
export * from './conversation';
export * from './member';
export * from './profile';
export * from './server';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface IPaginatedResult<T> {
  meta: PaginationMeta;
  data: T;
}

export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  result: T;
}

export interface ApiResponseWithPagination<T> {
  statusCode: number;
  message?: string;
  result: IPaginatedResult<T>;
}

export interface IBaseModel {
  id: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}
