module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/send-booking-email',
            handler: 'custom.sendBookingEmail',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/send-contact-email',
            handler: 'custom.sendContactEmail',
            config: {
                auth: false,
            },
        },
    ],
};