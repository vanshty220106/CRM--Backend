const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createCustomerSchema,
  updateCustomerSchema,
} = require('../validations/customerValidation');

// All customer routes require authentication
router.use(auth);

// POST   /api/customers       — Create (sales, manager, admin)
router.post(
  '/',
  authorize('admin', 'manager', 'sales'),
  validate(createCustomerSchema),
  customerController.createCustomer
);

// GET    /api/customers       — List all (any authenticated user)
router.get('/', customerController.getAllCustomers);

// GET    /api/customers/:id   — Get one (any authenticated user)
router.get('/:id', customerController.getCustomerById);

// PUT    /api/customers/:id   — Update (sales, manager, admin)
router.put(
  '/:id',
  authorize('admin', 'manager', 'sales'),
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

// DELETE /api/customers/:id   — Delete (manager, admin only)
router.delete(
  '/:id',
  authorize('admin', 'manager'),
  customerController.deleteCustomer
);

module.exports = router;
