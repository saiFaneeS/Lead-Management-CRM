import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import ApiError from "./ApiError.js";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailNotification = async (userId, subject, message) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found while trying to send notification email."
    );
  }

  const html = `<strong>${message}</strong>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      html,
    });
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(
      500,
      "Something went wrong while sending mail notification."
    );
  }
};

export default sendEmailNotification;
