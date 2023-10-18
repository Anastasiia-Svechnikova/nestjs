import { Expose } from 'class-transformer';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  showTotal?: boolean;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }

  @Expose()
  first: number;

  @Expose()
  last: number;

  @Expose()
  limit: number;

  @Expose()
  total?: number;

  @Expose()
  data: T[];
}
