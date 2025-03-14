export * from './member';
export * from './profile';
export * from './server';

export interface IPaginatedResult<T> {
  meta: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
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
