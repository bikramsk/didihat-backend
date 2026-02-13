'use strict';

module.exports = {
  async sendBookingEmail(ctx) {
    try {
      const { to, subject, customerName, customerPhone, cartItems, totals, bookingId: tempBookingId, userId, paymentMethod } = ctx.request.body;


      let newBooking = await strapi.entityService.create('api::booking.booking', {
        data: {
          bookingId: tempBookingId,
          customerName: customerName,
          customerEmail: to,
          customerPhone: customerPhone,
          bookingItems: cartItems,
          subtotal: totals.subtotal,
          tax: totals.tax,
          total: totals.total,
          itemCount: totals.itemCount,
          paymentMethod: paymentMethod || 'pay_at_hotel',
          paymentStatus: 'pending',
          bookingStatus: 'confirmed',
          bookingDate: new Date(),
          user: userId,
          publishedAt: new Date(),
        },
      });


      const finalBookingId = `${newBooking.id}`;

      newBooking = await strapi.entityService.update('api::booking.booking', newBooking.id, {
        data: { bookingId: finalBookingId },
      });

      const emailBookingId = `#${finalBookingId}`;


      const getTypeLabel = (type) => {
        const labels = {
          'stay': 'Stay',
          'attraction': 'Attraction',
          'tour-package': 'Tour Package',
          'car-rental': 'Car Rental'
        };
        return labels[type] || 'Item';
      };

      const itemsHTML = cartItems.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px;">
            <div style="font-weight: 600; color: #111827; font-size: 16px; margin-bottom: 6px;">
              ${item.name}
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 6px;">
              ${getTypeLabel(item.type)}
            </div>
            ${item.location ? `<div style="font-size: 13px; color: #111827; margin-bottom: 4px;"><strong>Location:</strong> ${item.location}</div>` : ''}
            ${item.selectedDate ? `<div style="font-size: 13px; color: #111827; margin-bottom: 4px;"><strong>Date:</strong> ${new Date(item.selectedDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>` : ''}
            ${item.selectedTime ? `<div style="font-size: 13px; color: #111827;"><strong>Time:</strong> ${item.selectedTime}</div>` : ''}
          </td>
          <td style="padding: 12px 8px; text-align: center; font-weight: 500;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #003B95;">₹${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `).join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #003B95 0%, #4F8CE5 100%); color: white; padding: 30px 40px; text-align: center; }
              .content { padding: 40px; }
              .details-box { background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #e2e8f0; }
              .summary-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #bae6fd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">DIDIHAT</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">Travel & Tourism</p>
              </div>
              <div class="content">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="color: #003B95; margin: 0;">Booking Confirmed!</h2>
                  <p style="color: #6b7280;">Booking ID: <strong style="color: #003B95;">${emailBookingId}</strong></p>
                </div>

                <p>Dear <strong>${customerName}</strong>,</p>
                <p>Thank you for choosing <strong>DIDIHAT</strong>! Your booking has been successfully confirmed. Payment will be collected directly at the hotel at the time of check-in.</p>
                <p>If you have any questions about your booking, simply reply to this email.</p>
                <p>We look forward to making your stay enjoyable!</p>

                <div class="details-box">
                  <h3 style="margin-top: 0;">Booking Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="border-bottom: 2px solid #d1d5db;">
                        <th style="text-align: left; padding: 12px 8px; color: #6b7280;">Item</th>
                        <th style="text-align: center; padding: 12px 8px; color: #6b7280;">Qty</th>
                        <th style="text-align: right; padding: 12px 8px; color: #6b7280;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHTML}</tbody>
                  </table>
                </div>

                <div class="summary-box">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span>Subtotal:</span><strong>₹${totals.subtotal.toLocaleString()}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span>Taxes (18% GST):</span><strong>₹${totals.tax.toLocaleString()}</strong>
                  </div>
                  <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 16px 0;">
                  <div style="display: flex; justify-content: space-between; font-size: 18px; color: #003B95;">
                    <strong>Total Amount:</strong><strong>₹${totals.total.toLocaleString()}</strong>
                  </div>
                  <p style="margin-top: 15px; font-size: 14px;"><strong>Payment Method:</strong> ${paymentMethod || 'Pay at Hotel'}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      // Send to customer
      await strapi.plugin('email').service('email').send({
        to,
        from: process.env.RESEND_FROM_EMAIL,
        replyTo: process.env.REPLY_TO_EMAIL,
        subject: `Booking Confirmation ${emailBookingId} - DIDIHAT`,
        html,
      });

      // Send to admin
      await strapi.plugin('email').service('email').send({
        to: process.env.REPLY_TO_EMAIL,
        from: process.env.RESEND_FROM_EMAIL,
        replyTo: to,
        subject: `New Booking Alert ${emailBookingId} - ${customerName}`,
        html: `<h3>New Booking Received</h3><p><strong>Customer:</strong> ${customerName}</p><p><strong>Email:</strong> ${to}</p><p><strong>Phone:</strong> ${customerPhone}</p>${html}`,
      });


      await strapi.entityService.update('api::booking.booking', newBooking.id, {
        data: { emailSent: true },
      });

      return { success: true, message: 'Booking saved and emails sent successfully' };
    } catch (err) {
      console.error('Email Error:', err);
      ctx.status = 500;
      ctx.body = { error: { message: err.message || 'Failed to send email' } };
    }
  },
  async sendContactEmail(ctx) {
    try {
      const { name, email, phone, subject, message } = ctx.request.body;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #003B95 0%, #4F8CE5 100%); color: white; padding: 30px 40px; text-align: center; }
              .content { padding: 40px; }
              .details-box { background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">DIDIHAT</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">New Contact Message</p>
              </div>
              <div class="content">
                <h2 style="color: #003B95; margin-bottom: 20px;">Message Details</h2>
                
                <div class="details-box">
                  <p><strong>From:</strong> ${name} (${email})</p>
                  <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                  <p><strong>Message:</strong></p>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                  This message was sent from the Didihat.com contact form.
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await strapi.plugin('email').service('email').send({
        to: process.env.REPLY_TO_EMAIL,
        from: process.env.RESEND_FROM_EMAIL,
        replyTo: email,
        subject: `New Contact Message: ${subject}`,
        html,
      });

      return { success: true, message: 'Contact email sent successfully' };
    } catch (err) {
      console.error('Contact Email Error:', err);
      ctx.status = 500;
      ctx.body = { error: { message: err.message || 'Failed to send contact email' } };
    }
  },
};
