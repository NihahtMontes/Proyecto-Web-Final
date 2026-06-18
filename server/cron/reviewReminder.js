const cron = require("node-cron");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const { sendReviewInvitation } = require("../utils/email");

const startReviewReminderCron = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const bookings = await Booking.find({
        checkOut: {
          $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
          $lte: new Date(yesterday.setHours(23, 59, 59, 999)),
        },
        status: "completada",
      }).populate("user");

      for (const booking of bookings) {
        const reviewExists = await Review.findOne({
          booking: booking._id,
        });

        if (!reviewExists && booking.user?.email) {
          await sendReviewInvitation(
            booking.user.email,
            booking
          );
        }
      }
    } catch (error) {
      console.error("Cron review reminder:", error);
    }
  });
};

module.exports = startReviewReminderCron;