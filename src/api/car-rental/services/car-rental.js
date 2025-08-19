'use strict';

/**
 * car-rental service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::car-rental.car-rental'); 