// File: src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// TypeScript interfaces
interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Define a more specific type for the install prompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function Home() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState<string>("");
  const [serviceWorkerRegistration, setServiceWorkerRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

    if (isInstalled) {
      setMessage("App is already installed");
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e as BeforeInstallPromptEvent);
    });

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
          setServiceWorkerRegistration(registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (!installPrompt) {
      setMessage(
        "App installation is not available or the app is already installed",
      );
      return;
    }

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the saved prompt since it can't be used twice
    setInstallPrompt(null);

    if (outcome === "accepted") {
      setMessage("App installed successfully!");
    } else {
      setMessage("App installation was declined");
    }
  };

  const handleNotificationClick = async (): Promise<void> => {
    if (!("Notification" in window)) {
      setMessage("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      // Send notification through our backend API
      try {
        const payload: NotificationPayload = {
          title: "Hello from PWA",
          body: "This is a test notification",
        };

        // First, check if we have a subscription
        if (serviceWorkerRegistration) {
          const subscription =
            await serviceWorkerRegistration.pushManager.getSubscription();

          if (!subscription) {
            // We need to subscribe first
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/vapid-public-key`,
            );
            const { publicKey } = await response.json();

            const convertedVapidKey = urlBase64ToUint8Array(publicKey);

            await serviceWorkerRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });

            setMessage(
              "Subscribed to notifications. Click again to receive one.",
            );
            return;
          }

          // We have a subscription, send the notification
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/send-notification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          );

          const data: ApiResponse = await response.json();

          if (data.success) {
            setMessage("Notification sent successfully!");
          } else {
            setMessage(`Failed to send notification: ${data.error}`);
          }
        } else {
          setMessage(
            "Service worker not registered. Cannot send notifications.",
          );
        }
      } catch (error) {
        console.error("Error sending notification:", error);
        setMessage("Error sending notification");
      }
    } else if (Notification.permission !== "denied") {
      // Request permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setMessage(
          "Notification permission granted. Click the button again to receive a notification.",
        );
      } else {
        setMessage("Notification permission denied");
      }
    } else {
      setMessage("Please enable notifications in your browser settings");
    }
  };

  // Helper function to convert VAPID key from base64 to Uint8Array
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  return (
    <main className="container">
      <h1 className="title">Simple PWA App</h1>

      <div className="image-container">
        <Image
          src="/app-image.jpg"
          alt="App Image"
          width={400}
          height={300}
          className="app-image"
          priority
        />
      </div>

      <div className="button-container">
        <button
          className="button"
          onClick={handleInstallClick}
          disabled={!installPrompt}
        >
          Install App
        </button>

        <button className="button" onClick={handleNotificationClick}>
          Send Notification
        </button>
      </div>

      {message && <div className="status">{message}</div>}
    </main>
  );
}
