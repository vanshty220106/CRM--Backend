const Joi = require('joi');

const addressSchema = Joi.object({
  street: Joi.string().trim().allow(''),
  city: Joi.string().trim().allow(''),
  state: Joi.string().trim().allow(''),
  zipCode: Joi.string().trim().allow(''),
  country: Joi.string().trim().allow(''),
});

const createCustomerSchema = Joi.object({
  name: Joi.string().trim().max(150).required().messages({
    'string.empty': 'Customer name is required',
    'string.max': 'Name cannot exceed 150 characters',
    'any.required': 'Customer name is required',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Customer email is required',
  }),
  phone: Joi.string().trim().max(20).allow('').messages({
    'string.max': 'Phone number cannot exceed 20 characters',
  }),
  company: Joi.string().trim().max(200).allow('').messages({
    'string.max': 'Company name cannot exceed 200 characters',
  }),
  status: Joi.string().valid('active', 'inactive', 'lead').default('lead').messages({
    'any.only': 'Status must be active, inactive, or lead',
  }),
  assignedTo: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'assignedTo must be a valid MongoDB ObjectId',
    }),
  notes: Joi.string().max(2000).allow('').messages({
    'string.max': 'Notes cannot exceed 2000 characters',
  }),
  address: addressSchema,
});

const updateCustomerSchema = Joi.object({
  name: Joi.string().trim().max(150).messages({
    'string.max': 'Name cannot exceed 150 characters',
  }),
  email: Joi.string().email().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string().trim().max(20).allow('').messages({
    'string.max': 'Phone number cannot exceed 20 characters',
  }),
  company: Joi.string().trim().max(200).allow('').messages({
    'string.max': 'Company name cannot exceed 200 characters',
  }),
  status: Joi.string().valid('active', 'inactive', 'lead').messages({
    'any.only': 'Status must be active, inactive, or lead',
  }),
  assignedTo: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'assignedTo must be a valid MongoDB ObjectId',
    }),
  notes: Joi.string().max(2000).allow('').messages({
    'string.max': 'Notes cannot exceed 2000 characters',
  }),
  address: addressSchema,
})
  .min(1) // At least one field must be provided for update
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

module.exports = { createCustomerSchema, updateCustomerSchema };
