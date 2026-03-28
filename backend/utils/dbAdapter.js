/**
 * db-adapter.js
 *
 * Returns the real Mongoose model when Atlas is connected,
 * or the local JSON-file collection when it is not.
 *
 * Usage (same as before):
 *   const { Complaint, User } = require('../utils/dbAdapter');
 *   const docs = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
 */
const mongoose = require('mongoose');
const { getCollection } = require('./localDb');

// Lazy-require models so this file can be loaded before mongoose connects
const getModel = (name) => mongoose.models[name] || mongoose.model(name);

const isConnected = () => mongoose.connection.readyState === 1;

/**
 * Creates a transparent proxy: when Atlas is live, uses the real Mongoose model.
 * When offline, falls back to the local JSON file collection.
 */
function makeAdapter(modelName, localName) {
  const proxy = {
    find: (...args) =>
      isConnected() ? getModel(modelName).find(...args) : getCollection(localName).find(...args),
    findById: (...args) =>
      isConnected() ? getModel(modelName).findById(...args) : getCollection(localName).findById(...args),
    findOne: (...args) =>
      isConnected() ? getModel(modelName).findOne(...args) : getCollection(localName).findOne(...args),
    create: (...args) =>
      isConnected() ? getModel(modelName).create(...args) : getCollection(localName).create(...args),
    countDocuments: (...args) =>
      isConnected() ? getModel(modelName).countDocuments(...args) : getCollection(localName).countDocuments(...args),
    aggregate: (...args) =>
      isConnected() ? getModel(modelName).aggregate(...args) : getCollection(localName).aggregate(...args),
  };
  return proxy;
}

const Complaint = makeAdapter('Complaint', 'complaints');
const User      = makeAdapter('User',      'users');

module.exports = { Complaint, User, isConnected };
