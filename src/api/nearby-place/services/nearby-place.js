'use strict';

/**
 * nearby-place service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::nearby-place.nearby-place');
