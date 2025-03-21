import express from "express";
import cors from "cors";
import webpush from "web-push";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
// Express app setup
const app = express();
const PORT = process.env.PORT || 5000;
// VAPID keys should be generated once and stored securely
// You can generate them using webpush.generateVAPIDKeys()
const publicVapidKey =
  process.env.PUBLIC_VAPID_KEY ||
  "BLBx-hf5ke9ld-q4snPFtEEgZPe-sH9qaWZZNB2nxoVx3PKTtv_eUTgYq2W98zEMqGQly-xD3nGaWXUQJnf7KYo";
const privateVapidKey =
  process.env.PRIVATE_VAPID_KEY ||
  "lMH4iiLbQLMaTxMV-Hh2LvXyFCdaQOZcvbmOXEgk3FY";
webpush.setVapidDetails(
  "mailto:test@example.com",
  publicVapidKey,
  privateVapidKey,
);
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Store subscriptions in memory (use a database in production)
const subscriptions = [];
// Routes
// Get VAPID public key
app.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: publicVapidKey });
});
// Subscribe route
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  // Validate subscription object
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ message: "Invalid subscription object" });
  }
  // Store the subscription (in production, check for duplicates)
  subscriptions.push(subscription);
  // Send 201 - resource created
  res.status(201).json({ message: "Subscription added successfully" });
  // Send a welcome notification
  const payload = JSON.stringify({
    title: "Welcome to Simple PWA",
    body: "You are now subscribed to notifications!",
  });
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error("Error sending welcome notification:", err));
});
// Notification route
app.post("/send-notification", (req, res) => {
  const { title, body, tag, url } = req.body;
  if (!title || !body) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }
  // If there are no subscriptions yet
  if (subscriptions.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No active subscriptions to send notifications to",
    });
  }
  const payload = JSON.stringify({
    title,
    body,
    tag: tag || "default",
    url: url || "/",
  });
  // Send to all subscriptions (in production use a more targeted approach)
  const sendPromises = subscriptions.map((subscription, index) =>
    webpush.sendNotification(subscription, payload).catch((err) => {
      console.error("Error sending notification:", err);
      // If subscription is invalid, remove it
      if (err.statusCode === 410) {
        subscriptions.splice(index, 1);
      }
      throw err;
    }),
  );
  Promise.allSettled(sendPromises)
    .then((results) => {
      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const failureCount = results.filter(
        (r) => r.status === "rejected",
      ).length;
      res.json({
        success: true,
        message: `Notifications sent: ${successCount} successful, ${failureCount} failed`,
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: "Error sending notifications",
      });
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", subscriptions: subscriptions.length });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
