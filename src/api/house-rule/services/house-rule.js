'use strict';

/**
 * house-rule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::house-rule.house-rule');
