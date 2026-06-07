import { Resend } from "resend";
import twilio from "twilio";

type NotificationPayload = {
  shopName: string;
  orderId: string;
  itemCount: number;
};

export async function sendOrderNotifications({
  shopName,
  orderId,
  itemCount,
}: NotificationPayload) {
  const tasks: Promise<unknown>[] = [];

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    tasks.push(
      resend.emails
        .send({
          from: process.env.RESEND_FROM_EMAIL || "orders@lakshanenterprises.com",
          to: process.env.ADMIN_EMAIL || "admin@lakshanenterprises.com",
          subject: `New Order: ${shopName} - #${orderId.slice(0, 6).toUpperCase()}`,
          html: `
            <p>A new order was just placed by <strong>${shopName}</strong>.</p>
            <p>Items: ${itemCount}</p>
            <p>Order ID: #${orderId.slice(0, 8).toUpperCase()}</p>
            <p>Check the admin dashboard to confirm.</p>
          `,
        })
        .catch(console.error),
    );
  }

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM &&
    process.env.ADMIN_WHATSAPP
  ) {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    tasks.push(
      twilioClient.messages
        .create({
          body: `New Order Alert!\nShop: ${shopName}\nItems: ${itemCount} pkts\nID: #${orderId
            .slice(0, 6)
            .toUpperCase()}`,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
          to: `whatsapp:${process.env.ADMIN_WHATSAPP}`,
        })
        .catch(console.error),
    );
  }

  await Promise.allSettled(tasks);
}
