/**
 * Build a Mongoose query with pagination, sorting and field selection.
 * Usage: const { data, meta } = await paginate(Model, query, req.query);
 */
const paginate = async (model, filter = {}, queryParams = {}, populate = "") => {
  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit) || 20));
  const skip = (page - 1) * limit;

  const sortField = queryParams.sortBy || "createdAt";
  const sortOrder = queryParams.order === "asc" ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate),
    model.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { paginate };
