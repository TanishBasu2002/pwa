import { NextRequest, NextResponse } from "next/server";
import webPush, { PushSubscription } from "web-push";

interface NotificationPayload {
  title: string;
  body: string;
}

// Initialize web-push with your VAPID keys
if (
  !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  !process.env.VAPID_PRIVATE_KEY
) {
  throw new Error("VAPID keys must be set in environment variables");
}

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails(
  "mailto:tanishbasu50@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

// In-memory storage for subscriptions (replace with database in production)
const subscriptions: PushSubscription[] = [];

export async function POST(request: NextRequest) {
  try {
    const { title, body }: NotificationPayload = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { success: false, error: "Missing required notification fields" },
        { status: 400 },
      );
    }

    // Send notification to all subscriptions
    const sendPromises = subscriptions.map((sub) =>
      webPush
        .sendNotification(sub, JSON.stringify({ title, body }))
        .catch((err) => console.error("Error sending notification:", err)),
    );

    await Promise.all(sendPromises);

    return NextResponse.json({
      success: true,
      message: "Notification sent to all subscribers",
    });
  } catch (error) {
    console.error("Notification processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process notification",
      },
      { status: 500 },
    );
  }
}

// Add a new endpoint to handle subscription storage
export async function PUT(request: NextRequest) {
  try {
    const subscription = await request.json();
    subscriptions.push(subscription);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription storage error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to store subscription" },
      { status: 500 },
    );
  }
}
