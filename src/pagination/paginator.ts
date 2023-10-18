import { SelectQueryBuilder } from 'typeorm';
import { PaginationOptions, PaginationResult } from './pagination.model';

export async function paginate<T>(
  query: SelectQueryBuilder<T>,
  options: PaginationOptions = {
    page: 1,
    limit: 10,
  },
): Promise<PaginationResult<T>> {
  const offset: number = (options.page - 1) * options.limit;

  const data: Array<T> = await query
    .limit(options.limit)
    .offset(offset)
    .getMany();

  return new PaginationResult({
    limit: options.limit,
    first: offset + 1,
    last: offset + data.length,
    data,
    total: options.showTotal ? await query.getCount() : null,
  });
}
