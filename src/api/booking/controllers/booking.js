'use strict';

/**
 * booking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({
  // Override the default find method to filter by user
  async find(ctx) {
    try {
      const { user } = ctx.state;

      console.log('Booking find called, user:', user);
      console.log('Auth header:', ctx.request.headers.authorization);

      if (!user) {
        // For testing, return empty array instead of error
        console.log('No user found, returning empty bookings');
        return ctx.send({
          data: [],
          meta: {
            pagination: {
              total: 0
            }
          }
        });
      }

      const { type, status } = ctx.query;

      // Build filters
      const filters = {
        user: user.id,
      };

      // Add status filter if provided
      if (status && status !== 'ALL') {
        if (status === 'CANCELLED') {
          filters.bookingStatus = 'cancelled';
        } else if (status === 'COMPLETED') {
          filters.bookingStatus = 'completed';
        }
      }

      console.log('Fetching bookings with filters:', filters);

      // Fetch bookings
      let bookings = await strapi.entityService.findMany('api::booking.booking', {
        filters,
        populate: ['user'],
        sort: { createdAt: 'desc' },
      });

      console.log('Found bookings:', bookings.length);

      // Filter by type if specified
      if (type && type !== 'ALL') {
        bookings = bookings.filter(booking => {
          const items = booking.bookingItems || [];
          return items.some(item => {
            switch (type) {
              case 'STAYS':
                return item.type === 'stay';
              case 'ATTRACTIONS':
                return item.type === 'attraction';
              case 'TOUR_PACKAGES':
                return item.type === 'tour-package';
              case 'CAR_RENTALS':
                return item.type === 'car-rental';
              case 'ACTIVITIES':
                return item.type === 'activity';
              default:
                return true;
            }
          });
        });
      }

      ctx.send({
        data: bookings,
        meta: {
          pagination: {
            total: bookings.length
          }
        }
      });
    } catch (error) {
      console.error('Error in booking find:', error);
      ctx.badRequest('Error fetching bookings', { error: error.message });
    }
  }
}));
