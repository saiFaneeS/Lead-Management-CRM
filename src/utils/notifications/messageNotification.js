import sendEmailNotification from "../sendEmailNotification.js";

export const notifyFirstMessage = async (sender, reciever, content) => {
  const subject = "New Chat Session";
  const message = `${sender?.fullName} has sent you a message and started a session.`;

  await sendEmailNotification(reciever._id, subject, message);
};

export const notifyNewMessage = async (sender, reciever, content) => {
  const subject = "New Message";
  const message = `${sender?.fullName} has sent you a message.`;

  await sendEmailNotification(reciever._id, subject, message);
};