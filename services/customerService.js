const Customer = require('../models/Customer');
const AppError = require('../utils/AppError');

/**
 * Create a new customer.
 * @param {object} data - Validated customer data.
 * @returns {object} The created customer document.
 */
const createCustomer = async (data) => {
  const customer = await Customer.create(data);
  return customer;
};

/**
 * Get all customers with pagination, filtering, and sorting.
 * @param {object} query - Express req.query object.
 * @returns {{ customers: object[], total: number, page: number, pages: number }}
 */
const getAllCustomers = async (query) => {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    status,
    company,
    search,
  } = query;

  const filter = {};

  if (status) filter.status = status;
  if (company) filter.company = { $regex: company, $options: 'i' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .populate('assignedTo', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

/**
 * Get a single customer by ID.
 * @param {string} id - Mongoose ObjectId.
 * @returns {object} Customer document.
 */
const getCustomerById = async (id) => {
  const customer = await Customer.findById(id).populate('assignedTo', 'name email role');

  if (!customer) {
    throw new AppError('Customer not found.', 404);
  }

  return customer;
};

/**
 * Update a customer by ID.
 * @param {string} id - Mongoose ObjectId.
 * @param {object} data - Fields to update.
 * @returns {object} Updated customer document.
 */
const updateCustomer = async (id, data) => {
  const customer = await Customer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('assignedTo', 'name email role');

  if (!customer) {
    throw new AppError('Customer not found.', 404);
  }

  return customer;
};

/**
 * Delete a customer by ID.
 * @param {string} id - Mongoose ObjectId.
 */
const deleteCustomer = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    throw new AppError('Customer not found.', 404);
  }

  return customer;
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
