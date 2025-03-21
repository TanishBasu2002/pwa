import { NextRequest, NextResponse } from "next/server";

interface NotificationRequestBody {
  title: string;
  body: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequestBody = await request.json();
    const { title, body: notificationBody } = body;

    if (!title || !notificationBody) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Forward the notification to our Node.js backend
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/send-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body: notificationBody }),
      },
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to send notification",
        },
        { status: backendResponse.status },
      );
    }

    const data = await backendResponse.json();

    return NextResponse.json({
      success: true,
      message: data.message || "Notification processed",
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process notification" },
      { status: 500 },
    );
  }
}
