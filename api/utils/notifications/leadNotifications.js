import { sendNotifications } from "../sendNotification.js";

export const notifyLeadAssigned = async (assignedTo, leadName) => {
  const subject = "New Lead Assigned";
  const message = `You have been assigned a new lead: ${leadName}`;
  const notificationType = "new_lead";

  await sendNotifications(assignedTo, subject, message, notificationType);
};

export const notifyLeadStatusChanged = async (
  assignedTo,
  leadName,
  newStatus
) => {
  const subject = "Lead Status Updated";
  const message = `The status of your lead "${leadName}" has been updated to "${newStatus}".`;
  const notificationType = "status_update";

  await sendNotifications(assignedTo, subject, message, notificationType);
};
