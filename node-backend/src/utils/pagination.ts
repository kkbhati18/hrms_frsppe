import { Model, FilterQuery } from "mongoose";

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: string;
  [key: string]: unknown;
}

export const paginate = async <T>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  queryParams: PaginationQuery = {},
  populate: string | string[] = ""
): Promise<PaginationResult<T>> => {
  const page = Math.max(1, parseInt(queryParams.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit as string) || 20));
  const skip = (page - 1) * limit;

  const sortField = queryParams.sortBy || "createdAt";
  const sortOrder = queryParams.order === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate as string),
    model.countDocuments(filter),
  ]);

  return {
    data: data as T[],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
