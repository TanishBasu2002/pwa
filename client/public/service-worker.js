// Listen for push events
self.addEventListener("push", (event) => {
  let data;
  try {
    data = event.data?.json();
  } catch (e) {
    data = {
      title: "Hello from PWA",
      body: "This is a push notification",
    };
  }

  const title = data?.title || "New notification";
  const options = {
    body: data?.body || "You have a new message",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: {
      url: "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});

// Register event listener for push subscription
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ),
      })
      .then((subscription) => {
        return fetch("/api/notifications", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });
      }),
  );
});
