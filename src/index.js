

// 'use strict';

// module.exports = {
//   /**
//    * An asynchronous register function that runs before
//    * your application is initialized.
//    *
//    * This gives you an opportunity to extend code.
//    */
//   register({ strapi }) {
//     // Register custom email route
//     strapi.server.routes([
//       {
//         method: 'POST',
//         path: '/api/send-booking-email',
//         handler: async (ctx) => {
//           try {
//             const { 
//               to, 
//               bookingId, 
//               subject, 
//               customerName, 
//               cartItems, 
//               totals, 
//               paymentMethod, 
//               paymentLink 
//             } = ctx.request.body;

//             // Validate required fields
//             if (!to || !bookingId || !customerName || !cartItems || !totals) {
//               return ctx.badRequest('Missing required fields');
//             }

//             // Generate sequential booking ID
//             const sequentialBookingId = await generateSequentialBookingId(strapi);

//             // Generate email content
//             const emailContent = {
//               to: to,
//               from: strapi.config.get('plugin.email.settings.defaultFrom'),
//               replyTo: strapi.config.get('plugin.email.settings.defaultReplyTo'),
//               subject: subject || `Booking Confirmation #${sequentialBookingId} - DIDIHAT`,
//               html: generateEmailTemplate({
//                 customerName,
//                 bookingId: sequentialBookingId,
//                 cartItems,
//                 totals,
//                 paymentMethod,
//                 paymentLink
//               }),
//               text: generateTextEmail({
//                 customerName,
//                 bookingId: sequentialBookingId,
//                 cartItems,
//                 totals,
//                 paymentMethod,
//                 paymentLink
//               })
//             };

//             // Send email using Strapi's email service
//             await strapi.plugins['email'].services.email.send(emailContent);

//             // Log the booking email for admin reference
//             strapi.log.info(`Booking confirmation email sent to ${to} for booking #${sequentialBookingId}`);

//             // Return success response
//             ctx.send({
//               success: true,
//               message: 'Booking confirmation email sent successfully',
//               bookingId: sequentialBookingId,
//               emailId: `email_${Date.now()}`,
//               sentTo: to
//             });

//           } catch (error) {
//             strapi.log.error('Error sending booking confirmation email:', error);
            
//             ctx.badRequest('Failed to send booking confirmation email', {
//               error: error.message,
//               details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//             });
//           }
//         },
//         config: {
//           policies: [],
//           middlewares: [],
//           auth: false,
//         },
//       },
//     ]);
//   },

//   /**
//    * An asynchronous bootstrap function that runs before
//    * your application gets started.
//    *
//    * This gives you an opportunity to set up your data model,
//    * run jobs, or perform some special logic.
//    */
//   bootstrap(/*{ strapi }*/) {},
// };

// // Helper function to generate sequential booking ID starting from 1
// async function generateSequentialBookingId(strapi) {
//   try {
   
//     const lastBooking = await strapi.db.query('api::booking.booking').findOne({
//       orderBy: { id: 'desc' },
//       select: ['id']
//     });

    
//     const nextId = lastBooking ? lastBooking.id + 1 : 1;
    
//     return nextId;
//   } catch (error) {
   
//     strapi.log.warn('Could not generate sequential booking ID, using timestamp fallback');
//     const timestamp = Date.now();
//     return Math.floor(timestamp / 1000) % 999999;
//   }
// }

// //EMAIL TEMPLATE
// function generateEmailTemplate({ customerName, bookingId, cartItems, totals, paymentMethod, paymentLink }) {
//   const itemsHTML = cartItems.map(item => `
//     <tr style="border-bottom: 1px solid #e5e7eb;">
//       <td style="padding: 12px 8px;">
//         <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.name}</div>
//         <div style="font-size: 14px; color: #6b7280; margin-bottom: 2px;">${getTypeLabel(item.type)}</div>
//         ${item.location ? `<div style="font-size: 12px; color: #9ca3af;">📍 ${item.location}</div>` : ''}
//         ${item.selectedDate ? `<div style="font-size: 12px; color: #9ca3af;">📅 ${new Date(item.selectedDate).toLocaleDateString()}</div>` : ''}
//         ${item.selectedTime ? `<div style="font-size: 12px; color: #9ca3af;">🕐 ${item.selectedTime}</div>` : ''}
//       </td>
//       <td style="padding: 12px 8px; text-align: center; font-weight: 500;">${item.quantity}</td>
//       <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #003B95;">₹${(item.price * item.quantity).toLocaleString()}</td>
//     </tr>
//   `).join('');

//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Booking Confirmation #${bookingId} - DIDIHAT</title>
//       </head>
//       <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb;">
//         <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
//           <!-- Header with Logo and Social Media -->
//           <div style="background: linear-gradient(135deg, #003B95 0%, #4F8CE5 100%); color: white; padding: 20px 40px;">
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="vertical-align: middle; text-align: left;">
//                   <!-- Logo on the left -->
//                   <img src="/uploads/didihat-logo-white.png" alt="DIDIHAT Logo" style="max-width: 180px; height: auto; display: block;">
//                 </td>
//                 <td style="vertical-align: middle; text-align: right;">
//                   <!-- Social media icons on the right -->
//                   <div style="white-space: nowrap;">
//                     <a href="https://facebook.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
//                       <span style="font-family: Arial; font-size: 14px; font-weight: bold;">f</span>
//                     </a>
//                     <a href="https://instagram.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
//                       <span style="font-family: Arial; font-size: 14px;">📷</span>
//                     </a>
//                     <a href="https://twitter.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
//                       <span style="font-family: Arial; font-size: 14px;">🐦</span>
//                     </a>
//                     <a href="https://linkedin.com/company/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
//                       <span style="font-family: Arial; font-size: 12px; font-weight: bold;">in</span>
//                     </a>
//                     <a href="https://youtube.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
//                       <span style="font-family: Arial; font-size: 14px;">▶</span>
//                     </a>
//                   </div>
//                 </td>
//               </tr>
//             </table>
//           </div>

//           <!-- Content -->
//           <div style="padding: 40px;">
//             <div style="text-align: center; margin-bottom: 30px;">
//               <h1 style="color: #003B95; margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Booking Confirmed! 🎉</h1>
//               <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 12px 20px; display: inline-block; border: 1px solid #bae6fd;">
//                 <p style="margin: 0; font-size: 18px; color: #0c4a6e; font-weight: 600;">Booking ID: #${bookingId}</p>
//               </div>
//             </div>

//             <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563; text-align: center;">
//               Dear <strong style="color: #003B95;">${customerName || 'Valued Customer'}</strong>,<br><br>
//               Thank you for choosing DIDIHAT! Your booking has been confirmed successfully. Please complete your payment using the secure link below to finalize your reservation.
//             </p>

//             <!-- Booking Details -->
//             <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #e2e8f0;">
//               <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
//                 <span style="margin-right: 8px;">📋</span> Booking Details
//               </h3>
//               <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                   <tr style="border-bottom: 2px solid #d1d5db;">
//                     <th style="text-align: left; padding: 12px 8px; color: #6b7280; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Item Details</th>
//                     <th style="text-align: center; padding: 12px 8px; color: #6b7280; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
//                     <th style="text-align: right; padding: 12px 8px; color: #6b7280; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${itemsHTML}
//                 </tbody>
//               </table>
//             </div>

//             <!-- Payment Summary -->
//             <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #bae6fd;">
//               <h3 style="margin: 0 0 20px 0; color: #0c4a6e; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
//                 <span style="margin-right: 8px;">💰</span> Payment Summary
//               </h3>
//               <div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(12, 74, 110, 0.1);">
//                   <span style="color: #475569; font-size: 15px;">Subtotal (${totals.itemCount} items):</span>
//                   <span style="font-weight: 600; color: #0c4a6e; font-size: 15px;">₹${totals.subtotal.toLocaleString()}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(12, 74, 110, 0.1);">
//                   <span style="color: #475569; font-size: 15px;">Taxes & Fees:</span>
//                   <span style="font-weight: 600; color: #0c4a6e; font-size: 15px;">₹${totals.tax.toLocaleString()}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background: rgba(3, 59, 149, 0.1); border-radius: 8px; border: 1px solid rgba(3, 59, 149, 0.2);">
//                   <span style="font-size: 20px; font-weight: 700; color: #003B95;">Total Amount:</span>
//                   <span style="font-size: 24px; font-weight: 700; color: #003B95;">₹${totals.total.toLocaleString()}</span>
//                 </div>
//                 <div style="background-color: rgba(59, 130, 246, 0.1); padding: 16px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);">
//                   <div style="font-size: 14px; color: #1e40af; display: flex; align-items: center;">
//                     <span style="margin-right: 8px;">💳</span>
//                     <strong>Payment Method:</strong> <span style="margin-left: 8px;">${getPaymentMethodLabel(paymentMethod)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <!-- Payment Button -->
//             <div style="text-align: center; margin: 40px 0;">
//               <a href="${paymentLink}" 
//                  style="display: inline-block; background: linear-gradient(135deg, #003B95 0%, #1d4ed8 100%); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(3, 59, 149, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;"
//                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(3, 59, 149, 0.4)'"
//                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(3, 59, 149, 0.3)'">
//                 💳 Complete Payment Now
//               </a>
//               <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
//                 🔒 <strong>Secure Payment</strong> • Link expires in 24 hours • SSL Protected
//               </p>
//             </div>

//             <!-- Important Notice -->
//             <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border: 1px solid #f59e0b;">
//               <h4 style="margin: 0 0 12px 0; color: #92400e; display: flex; align-items: center;">
//                 <span style="margin-right: 8px;">⚠️</span> Important Notice
//               </h4>
//               <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
//                 Please complete your payment within 24 hours to secure your booking. After this period, your reservation may be automatically cancelled and availability cannot be guaranteed.
//               </p>
//             </div>

//             <!-- Contact Info -->
//             <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; margin-top: 40px;">
//               <h4 style="margin: 0 0 20px 0; color: #374151; font-size: 18px; display: flex; align-items: center;">
//                 <span style="margin-right: 8px;">🤝</span> Need Help?
//               </h4>
//               <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
//                 <p style="margin: 0 0 16px 0; font-size: 15px; color: #4b5563;">
//                   Our customer support team is here to assist you with any questions or concerns about your booking.
//                 </p>
//                 <div style="display: flex; flex-wrap: wrap; gap: 20px;">
//                   <div style="flex: 1; min-width: 200px;">
//                     <p style="margin: 0; font-size: 14px; color: #6b7280;">
//                       📧 <strong>Email:</strong><br>
//                       <a href="mailto:contact@didihat.com" style="color: #003B95; text-decoration: none; font-weight: 500;">contact@didihat.com</a>
//                     </p>
//                   </div>
//                   <div style="flex: 1; min-width: 200px;">
//                     <p style="margin: 0; font-size: 14px; color: #6b7280;">
//                       📞 <strong>Phone:</strong><br>
//                       <a href="tel:+919410116800" style="color: #003B95; text-decoration: none; font-weight: 500;">+91 9410116800</a>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- Footer -->
//           <div style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
//             <div style="margin-bottom: 20px;">
//               <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
//                 Thank you for choosing DIDIHAT for your travel needs. We're committed to making your experience memorable!
//               </p>
//               <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 20px;">
//                 <span style="font-size: 13px; color: #6b7280; display: flex; align-items: center;">
//                   <span style="margin-right: 4px;">📧</span> contact@didihat.com
//                 </span>
//                 <span style="font-size: 13px; color: #6b7280; display: flex; align-items: center;">
//                   <span style="margin-right: 4px;">📞</span> +91 9410116800
//                 </span>
//                 <span style="font-size: 13px; color: #6b7280; display: flex; align-items: center;">
//                   <span style="margin-right: 4px;">📍</span> Uttarakhand, India
//                 </span>
//               </div>
//             </div>
//             <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
//               <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
//                 © 2024 DIDIHAT. All rights reserved. | Premium Travel & Tourism Services
//               </p>
//               <p style="margin: 0; font-size: 11px; color: #9ca3af;">
//                 This email was sent to you because you made a booking with DIDIHAT. Please do not reply to this email.
//               </p>
//             </div>
//           </div>
//         </div>
//       </body>
//     </html>
//   `;
// }

// // Helper function to generate text email
// function generateTextEmail({ customerName, bookingId, cartItems, totals, paymentMethod, paymentLink }) {
//   const itemsText = cartItems.map(item => 
//     `${item.name} (${getTypeLabel(item.type)}) - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
//   ).join('\n');

//   return `
// DIDIHAT - Booking Confirmation #${bookingId}

// Dear ${customerName || 'Valued Customer'},

// 🎉 Your booking has been confirmed successfully!
// Booking ID: #${bookingId}

// 📋 BOOKING DETAILS:
// ${itemsText}

// 💰 PAYMENT SUMMARY:
// Subtotal: ₹${totals.subtotal.toLocaleString()}
// Taxes & Fees: ₹${totals.tax.toLocaleString()}
// Total Amount: ₹${totals.total.toLocaleString()}
// Payment Method: ${getPaymentMethodLabel(paymentMethod)}

// 💳 COMPLETE PAYMENT:
// ${paymentLink}
// ⚠️ Payment link expires in 24 hours

// 🤝 NEED HELP?
// Email: contact@didihat.com
// Phone: +91 9410116800

// 🌐 FOLLOW US:
// Facebook: https://facebook.com/didihat
// Instagram: https://instagram.com/didihat
// Twitter: https://twitter.com/didihat
// LinkedIn: https://linkedin.com/company/didihat
// YouTube: https://youtube.com/didihat

// Thank you for choosing DIDIHAT!

// © 2024 DIDIHAT - All rights reserved

//   `;
// }

// // Helper functions
// function getTypeLabel(type) {
//   const labels = {
//     'stay': 'Stay',
//     'attraction': 'Attraction',
//     'tour-package': 'Tour Package',
//     'car-rental': 'Car Rental'
//   };
//   return labels[type] || 'Item';
// }

// function getPaymentMethodLabel(method) {
//   const labels = {
//     'upi': 'UPI Payment',
//     'card': 'Credit/Debit Card',
//     'netbanking': 'Net Banking',
//     'wallet': 'Digital Wallet'
//   };
//   return labels[method] || 'Selected Payment Method';
// }

'use strict';

// Simple counter for booking IDs (starts from 1)
let bookingCounter = 1;

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }) {
    // Register custom email route
    strapi.server.routes([
      {
        method: 'POST',
        path: '/api/send-booking-email',
        handler: async (ctx) => {
          try {
            const {
              to,
              subject,
              customerName,
              cartItems,
              totals,
              paymentMethod,
              paymentLink,
              userId
            } = ctx.request.body;

            // Debug logging
            strapi.log.info('Email handler received data:', {
              to,
              customerName,
              userId,
              cartItemsCount: cartItems?.length,
              totals
            });

            // Validate required fields
            if (!to || !customerName || !cartItems || !totals) {
              return ctx.badRequest('Missing required fields');
            }

            // Generate sequential booking ID starting from 1
            const sequentialBookingId = bookingCounter++;

            // Generate email content
            const emailContent = {
              to: to,
              from: strapi.config.get('plugin.email.settings.defaultFrom'),
              replyTo: strapi.config.get('plugin.email.settings.defaultReplyTo'),
              subject: subject || `Booking Confirmation #${sequentialBookingId} - DIDIHAT`,
              html: generateEmailTemplate({
                customerName,
                bookingId: sequentialBookingId,
                cartItems,
                totals,
                paymentMethod,
                paymentLink
              }),
              text: generateTextEmail({
                customerName,
                bookingId: sequentialBookingId,
                cartItems,
                totals,
                paymentMethod,
                paymentLink
              })
            };

            // Send email using Strapi's email service
            await strapi.plugins['email'].services.email.send(emailContent);

            // Save booking to database if user is logged in
            if (userId) {
              try {
                strapi.log.info(`Attempting to save booking for user ${userId}, booking #${sequentialBookingId}`);

                const booking = await strapi.entityService.create('api::booking.booking', {
                  data: {
                    bookingId: sequentialBookingId.toString(),
                    user: userId,
                    customerName,
                    customerEmail: to,
                    bookingItems: cartItems,
                    subtotal: totals.subtotal,
                    tax: totals.tax,
                    total: totals.total,
                    itemCount: totals.itemCount,
                    paymentMethod: paymentMethod || 'pending',
                    bookingDate: new Date(),
                    emailSent: true,
                    publishedAt: new Date(),
                  },
                });

                strapi.log.info(`Booking saved successfully: ${booking.id} for user ${userId}, booking #${sequentialBookingId}`);
              } catch (dbError) {
                strapi.log.error('Error saving booking to database:', dbError);
                // Don't fail the email sending if database save fails
              }
            } else {
              strapi.log.info('No userId provided, skipping database save');
            }

            // Log the booking email for admin reference
            strapi.log.info(`Booking confirmation email sent to ${to} for booking #${sequentialBookingId}`);

            // Return success response
            ctx.send({
              success: true,
              message: 'Booking confirmation email sent successfully',
              bookingId: sequentialBookingId,
              emailId: `email_${Date.now()}`,
              sentTo: to
            });

          } catch (error) {
            strapi.log.error('Error sending booking confirmation email:', error);
            
            ctx.badRequest('Failed to send booking confirmation email', {
              error: error.message,
              details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
          }
        },
        config: {
          policies: [],
          middlewares: [],
          auth: false,
        },
      },
    ]);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap({ strapi }) {
    // Initialize booking counter from environment or start from 1
    const savedCounter = process.env.BOOKING_COUNTER || 1;
    bookingCounter = parseInt(savedCounter);
    strapi.log.info(`Booking counter initialized at: ${bookingCounter}`);
  },
};

// EMAIL TEMPLATE FUNCTION
function generateEmailTemplate({ customerName, bookingId, cartItems, totals, paymentMethod, paymentLink }) {
  const itemsHTML = cartItems.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 8px;">
        <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.name}</div>
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 2px;">${getTypeLabel(item.type)}</div>
        ${item.location ? `<div style="font-size: 12px; color: #9ca3af;">📍 ${item.location}</div>` : ''}
        ${item.selectedDate ? `<div style="font-size: 12px; color: #9ca3af;">📅 ${new Date(item.selectedDate).toLocaleDateString()}</div>` : ''}
        ${item.selectedTime ? `<div style="font-size: 12px; color: #9ca3af;">🕐 ${item.selectedTime}</div>` : ''}
      </td>
      <td style="padding: 12px 8px; text-align: center; font-weight: 500;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #003B95;">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation #${bookingId} - DIDIHAT</title>
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logo and Social Media -->
          <div style="background: linear-gradient(135deg, #003B95 0%, #4F8CE5 100%); color: white; padding: 20px 40px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: middle; text-align: left;">
                  <!-- Logo on the left -->
                  <img src="/didihat-logo.png" alt="DIDIHAT Logo" style="max-width: 180px; height: auto; display: block; filter: brightness(0) invert(1);">
                </td>
                <td style="vertical-align: middle; text-align: right;">
                  <!-- Social media icons on the right -->
                  <div style="white-space: nowrap;">
                    <a href="https://facebook.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px;">
                      <span style="font-family: Arial; font-size: 14px; font-weight: bold;">f</span>
                    </a>
                    <a href="https://instagram.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px;">
                      <span style="font-family: Arial; font-size: 14px;">📷</span>
                    </a>
                    <a href="https://twitter.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px;">
                      <span style="font-family: Arial; font-size: 14px;">🐦</span>
                    </a>
                    <a href="https://linkedin.com/company/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px;">
                      <span style="font-family: Arial; font-size: 12px; font-weight: bold;">in</span>
                    </a>
                    <a href="https://youtube.com/didihat" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; text-align: center; line-height: 30px; color: white; text-decoration: none; margin-left: 8px;">
                      <span style="font-family: Arial; font-size: 14px;">▶</span>
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Content -->
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #003B95; margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Booking Confirmed! 🎉</h1>
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 12px 20px; display: inline-block; border: 1px solid #bae6fd;">
                <p style="margin: 0; font-size: 18px; color: #0c4a6e; font-weight: 600;">Booking ID: #${bookingId}</p>
              </div>
            </div>

            <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563; text-align: center;">
              Dear <strong style="color: #003B95;">${customerName || 'Valued Customer'}</strong>,<br><br>
              Thank you for choosing DIDIHAT! Your booking has been confirmed successfully. Please complete your payment using the secure link below.
            </p>

            <!-- Booking Details -->
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 18px; font-weight: 600;">
                📋 Booking Details
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #d1d5db;">
                    <th style="text-align: left; padding: 12px 8px; color: #6b7280; font-weight: 600; font-size: 14px;">Item Details</th>
                    <th style="text-align: center; padding: 12px 8px; color: #6b7280; font-weight: 600; font-size: 14px;">Qty</th>
                    <th style="text-align: right; padding: 12px 8px; color: #6b7280; font-weight: 600; font-size: 14px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </div>

            <!-- Payment Summary -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #bae6fd;">
              <h3 style="margin: 0 0 20px 0; color: #0c4a6e; font-size: 18px; font-weight: 600;">
                💰 Payment Summary
              </h3>
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0;">
                  <span style="color: #475569;">Subtotal (${totals.itemCount} items):</span>
                  <span style="font-weight: 600; color: #0c4a6e;">₹${totals.subtotal.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0;">
                  <span style="color: #475569;">Taxes & Fees:</span>
                  <span style="font-weight: 600; color: #0c4a6e;">₹${totals.tax.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 16px; background: rgba(3, 59, 149, 0.1); border-radius: 8px;">
                  <span style="font-size: 20px; font-weight: 700; color: #003B95;">Total Amount:</span>
                  <span style="font-size: 24px; font-weight: 700; color: #003B95;">₹${totals.total.toLocaleString()}</span>
                </div>
                <div style="background-color: rgba(59, 130, 246, 0.1); padding: 16px; border-radius: 8px;">
                  <div style="font-size: 14px; color: #1e40af;">
                    💳 <strong>Payment Method:</strong> ${getPaymentMethodLabel(paymentMethod)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${paymentLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #003B95 0%, #1d4ed8 100%); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(3, 59, 149, 0.3);">
                💳 Complete Payment Now
              </a>
              <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
                🔒 Secure Payment • Link expires in 24 hours
              </p>
            </div>

            <!-- Contact Info -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; margin-top: 40px;">
              <h4 style="margin: 0 0 20px 0; color: #374151; font-size: 18px;">
                🤝 Need Help?
              </h4>
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #4b5563;">
                  Our support team is here to help with any questions about your booking.
                </p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  📧 <strong>Email:</strong> <a href="mailto:contact@didihat.com" style="color: #003B95;">contact@didihat.com</a><br>
                  📞 <strong>Phone:</strong> <a href="tel:+919410116800" style="color: #003B95;">+91 9410116800</a>
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
              Thank you for choosing DIDIHAT for your travel needs!
            </p>
            <div style="margin-bottom: 20px;">
              <span style="font-size: 13px; color: #6b7280; margin: 0 12px;">📧 contact@didihat.com</span>
              <span style="font-size: 13px; color: #6b7280; margin: 0 12px;">📞 +91 9410116800</span>
              <span style="font-size: 13px; color: #6b7280; margin: 0 12px;">📍 Uttarakhand, India</span>
            </div>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              © 2024 DIDIHAT. All rights reserved. | Travel & Tourism Services
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper function to generate text email
function generateTextEmail({ customerName, bookingId, cartItems, totals, paymentMethod, paymentLink }) {
  const itemsText = cartItems.map(item => 
    `${item.name} (${getTypeLabel(item.type)}) - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');

  return `
DIDIHAT - Booking Confirmation #${bookingId}

Dear ${customerName || 'Valued Customer'},

🎉 Your booking has been confirmed!
Booking ID: #${bookingId}

📋 BOOKING DETAILS:
${itemsText}

💰 PAYMENT SUMMARY:
Subtotal: ₹${totals.subtotal.toLocaleString()}
Taxes & Fees: ₹${totals.tax.toLocaleString()}
Total Amount: ₹${totals.total.toLocaleString()}
Payment Method: ${getPaymentMethodLabel(paymentMethod)}

💳 COMPLETE PAYMENT:
${paymentLink}

🤝 NEED HELP?
Email: contact@didihat.com
Phone: +91 9410116800

🌐 FOLLOW US:
Facebook: https://facebook.com/didihat
Instagram: https://instagram.com/didihat
Twitter: https://twitter.com/didihat
LinkedIn: https://linkedin.com/company/didihat
YouTube: https://youtube.com/didihat

Thank you for choosing DIDIHAT!
© 2024 DIDIHAT - All rights reserved
  `;
}

// Helper functions
function getTypeLabel(type) {
  const labels = {
    'stay': 'Stay',
    'attraction': 'Attraction',
    'tour-package': 'Tour Package',
    'car-rental': 'Car Rental'
  };
  return labels[type] || 'Item';
}

function getPaymentMethodLabel(method) {
  const labels = {
    'upi': 'UPI Payment',
    'card': 'Credit/Debit Card',
    'netbanking': 'Net Banking',
    'wallet': 'Digital Wallet'
  };
  return labels[method] || 'Selected Payment Method';
}