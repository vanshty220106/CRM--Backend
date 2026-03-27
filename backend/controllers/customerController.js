const customerService = require('../services/customerService');

/**
 * @route   POST /api/customers
 * @desc    Create a new customer
 * @access  Private (sales, manager, admin)
 */
const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);

    res.status(201).json({
      status: 'success',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/customers
 * @desc    Get all customers with pagination & filtering
 * @access  Private
 */
const getAllCustomers = async (req, res, next) => {
  try {
    const result = await customerService.getAllCustomers(req.query);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/customers/:id
 * @desc    Get a single customer
 * @access  Private
 */
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/customers/:id
 * @desc    Update a customer
 * @access  Private (sales, manager, admin)
 */
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete a customer
 * @access  Private (manager, admin)
 */
const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Customer deleted successfully.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
