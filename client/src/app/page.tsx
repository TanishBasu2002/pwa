"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

// Define a more specific type for the install prompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Developer profile data
const developerProfile = {
  totalExperience: "3 months",
  mernExperience: "1 years",
  nextReactExperience: "1 years",
  nodeExperience: "2 years",
  postgresExperience: "1 years",
  architectureExperience: "1 years",
  designPatternsExperience: "6 months",
  workStatus: "Freelancer",
  hoursPerDay: "any time",
  timePerPage: "1-2 days",
  previousProjects: [
    { name: "HackHubb", url: "https://hackhubb.vercel.app/" },
    { name: "Spotify Clone", url: "https://spotify-clone-tanish.vercel.app/" },
    { name: "Ai Summerizer", url: "https://summerizer.netlify.app/" },
  ],
  portfolioLink: "https://tanish-basu-portfolio.vercel.app/",
  startAvailability: "Immediately",
  developerType: "Individual developer",
  vpsDeployment: "Yes",
  cicdExperience: "Yes - GitHub Actions",
  secureProjects: "Have a little experience",
  githubProfile: "https://github.com/TanishBasu2002",
  budgetComfortable: "Yes",
};

export default function Home() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState<string>("");
  const [serviceWorkerRegistration, setServiceWorkerRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  // tslint:disable-next-line @ts-ignore
  const [fileContent, setFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("developer-profile.pdf");
  const [activeTab, setActiveTab] = useState<string>("profile");

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

    // Generate and open a PDF file when the application runs
    generateAndOpenPDF();
  }, []);

  const generateAndOpenPDF = (): void => {
    // Generate content from developer profile
    const profileText = `
Developer Profile:
-----------------
Total Professional Development Experience: ${developerProfile.totalExperience}
MERN Stack Experience: ${developerProfile.mernExperience}
Next.js/React.js Experience: ${developerProfile.nextReactExperience}
Node.js Experience: ${developerProfile.nodeExperience}
PostgreSQL Experience: ${developerProfile.postgresExperience}
Software Architecture Experience: ${developerProfile.architectureExperience}
Design Patterns Experience: ${developerProfile.designPatternsExperience}
Work Status: ${developerProfile.workStatus}
Hours Per Day: ${developerProfile.hoursPerDay}
Time Per Page: ${developerProfile.timePerPage}
Previous Projects: ${developerProfile.previousProjects.map((p) => p.name).join(", ")}
Portfolio: ${developerProfile.portfolioLink}
Start Availability: ${developerProfile.startAvailability}
Developer Type: ${developerProfile.developerType}
VPS Deployment: ${developerProfile.vpsDeployment}
CI/CD Experience: ${developerProfile.cicdExperience}
Secure Projects: ${developerProfile.secureProjects}
GitHub: ${developerProfile.githubProfile}
Budget Comfortable: ${developerProfile.budgetComfortable}

Generated on: ${new Date().toString()}
    `;

    // Set the content
    setFileContent(profileText);

    // Create a PDF file
    const pdf = new jsPDF();

    // Set title
    pdf.setFontSize(16);
    pdf.text("Developer Profile", 105, 15, { align: "center" });

    // Add content with line breaks
    pdf.setFontSize(12);
    const lines = profileText.split("\n");
    let y = 25;

    lines.forEach((line) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 10, y);
      y += 7;
    });

    // Save the PDF
    pdf.save(fileName);

    setMessage("Developer profile PDF has been generated and opened");
  };

  const handleGenerateFile = (): void => {
    // Get current timestamp for unique filename
    const timestamp = new Date().getTime();
    const newFileName = `developer-profile-${timestamp}.pdf`;
    setFileName(newFileName);

    // Create a PDF file
    const pdf = new jsPDF();

    // Set title and styling
    pdf.setFontSize(16);
    pdf.setTextColor(0, 51, 153);
    pdf.text("Developer Profile", 105, 15, { align: "center" });

    // Add content with line breaks
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Add developer information sections
    let y = 25;

    // Professional Experience Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Professional Experience", 10, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Total Experience: ${developerProfile.totalExperience}`, 15, y);
    y += 7;
    pdf.text(
      `MERN Stack Experience: ${developerProfile.mernExperience}`,
      15,
      y,
    );
    y += 7;
    pdf.text(
      `Next.js/React.js Experience: ${developerProfile.nextReactExperience}`,
      15,
      y,
    );
    y += 7;
    pdf.text(`Node.js Experience: ${developerProfile.nodeExperience}`, 15, y);
    y += 7;
    pdf.text(
      `PostgreSQL Experience: ${developerProfile.postgresExperience}`,
      15,
      y,
    );
    y += 7;
    pdf.text(
      `Software Architecture Experience: ${developerProfile.architectureExperience}`,
      15,
      y,
    );
    y += 7;
    pdf.text(
      `Design Patterns Experience: ${developerProfile.designPatternsExperience}`,
      15,
      y,
    );
    y += 12;

    // Project Details Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Project Details", 10, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Work Status: ${developerProfile.workStatus}`, 15, y);
    y += 7;
    pdf.text(`Hours per day available: ${developerProfile.hoursPerDay}`, 15, y);
    y += 7;
    pdf.text(`Time to deliver 1 page: ${developerProfile.timePerPage}`, 15, y);
    y += 7;
    pdf.text(
      `Start availability: ${developerProfile.startAvailability}`,
      15,
      y,
    );
    y += 7;
    pdf.text(`Developer type: ${developerProfile.developerType}`, 15, y);
    y += 7;
    pdf.text(
      `Budget comfortable: ${developerProfile.budgetComfortable}`,
      15,
      y,
    );
    y += 12;

    // Technical Capabilities Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Technical Capabilities", 10, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`VPS Deployment: ${developerProfile.vpsDeployment}`, 15, y);
    y += 7;
    pdf.text(`CI/CD Experience: ${developerProfile.cicdExperience}`, 15, y);
    y += 7;
    pdf.text(`Secure Projects: ${developerProfile.secureProjects}`, 15, y);
    y += 7;
    pdf.text(`GitHub profile: ${developerProfile.githubProfile}`, 15, y);
    y += 12;

    // Previous Projects & Portfolio Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Previous Projects & Portfolio", 10, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Previous professional projects:", 15, y);
    y += 7;

    developerProfile.previousProjects.forEach((project) => {
      pdf.text(`- ${project.name}: ${project.url}`, 20, y);
      y += 7;
    });

    y += 5;
    pdf.text(`Portfolio: ${developerProfile.portfolioLink}`, 15, y);
    y += 10;

    // Generated date
    pdf.text(`Generated on: ${new Date().toString()}`, 15, y);

    // Save the PDF
    pdf.save(newFileName);

    setMessage(`New PDF "${newFileName}" has been generated and opened`);
  };

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

  const subscribeToPushNotifications =
    async (): Promise<PushSubscription | null> => {
      if (!serviceWorkerRegistration) {
        console.error("Service worker not registered");
        return null;
      }

      try {
        const subscription =
          await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
            ),
          });

        console.log("Push subscription successful", subscription);
        return subscription;
      } catch (error) {
        console.error("Error subscribing to push notifications:", error);
        return null;
      }
    };

  const handleNotificationClick = async (): Promise<void> => {
    if (!("Notification" in window)) {
      setMessage("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      try {
        // First ensure we're subscribed to push
        const subscription = await subscribeToPushNotifications();
        if (!subscription) {
          setMessage("Failed to subscribe to push notifications");
          return;
        }

        // Store the subscription
        const storeResponse = await fetch("/api/notifications", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        if (!storeResponse.ok) {
          throw new Error("Failed to store subscription");
        }

        // Send test notification
        const payload = {
          title: "Hello from PWA",
          body: "This is a test notification",
        };

        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
          setMessage("Notification sent successfully!");
        } else {
          setMessage(`Failed to send notification: ${data.error}`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
        setMessage("Error sending notification");
      }
    } else if (Notification.permission !== "denied") {
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

  // Create a list item for developer details
  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="py-3 border-b border-gray-200">
      <dt className="font-semibold text-gray-700">{label}</dt>
      <dd className="mt-1 text-gray-900">{value}</dd>
    </div>
  );

  // Project link item component
  const ProjectLink = ({ name, url }: { name: string; url: string }) => (
    <li className="py-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {name}
      </a>
    </li>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-white">
            Developer Profile & PWA Demo
          </h1>
          <p className="text-blue-100 mt-2">
            Showcasing experience and interactive features
          </p>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Developer Profile
            </button>
            <button
              onClick={() => setActiveTab("pwa")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "pwa"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              PWA Features
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* Developer Profile Tab */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column - Basic info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Professional Experience
                </h2>
                <dl>
                  <DetailItem
                    label="Years of total professional development experience"
                    value={developerProfile.totalExperience}
                  />
                  <DetailItem
                    label="Years of experience with MERN stack"
                    value={developerProfile.mernExperience}
                  />
                  <DetailItem
                    label="Years of experience with Next.js/React.js"
                    value={developerProfile.nextReactExperience}
                  />
                  <DetailItem
                    label="Years of experience with Node.js"
                    value={developerProfile.nodeExperience}
                  />
                  <DetailItem
                    label="Years of experience with PostgreSQL"
                    value={developerProfile.postgresExperience}
                  />
                  <DetailItem
                    label="Years of experience with software Architecture"
                    value={developerProfile.architectureExperience}
                  />
                  <DetailItem
                    label="Years of experience with design patterns"
                    value={developerProfile.designPatternsExperience}
                  />
                </dl>
              </div>

              {/* Right column - Project info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Project Details
                </h2>
                <dl>
                  <DetailItem
                    label="Work Status"
                    value={developerProfile.workStatus}
                  />
                  <DetailItem
                    label="Hours per day available"
                    value={developerProfile.hoursPerDay}
                  />
                  <DetailItem
                    label="Time to deliver 1 page"
                    value={developerProfile.timePerPage}
                  />
                  <DetailItem
                    label="Start availability"
                    value={developerProfile.startAvailability}
                  />
                  <DetailItem
                    label="Developer type"
                    value={developerProfile.developerType}
                  />
                  <DetailItem
                    label="Budget comfortable"
                    value={developerProfile.budgetComfortable}
                  />
                </dl>
              </div>

              {/* Technical skills */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Technical Capabilities
                </h2>
                <dl>
                  <DetailItem
                    label="VPS Deployment"
                    value={developerProfile.vpsDeployment}
                  />
                  <DetailItem
                    label="CI/CD Experience"
                    value={developerProfile.cicdExperience}
                  />
                  <DetailItem
                    label="Secure Projects with DDoS protection & SQL injection prevention"
                    value={developerProfile.secureProjects}
                  />
                  <DetailItem
                    label="GitHub profile"
                    value={developerProfile.githubProfile}
                  />
                </dl>
              </div>

              {/* Previous projects */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Previous Projects & Portfolio
                </h2>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">
                    Previous professional projects:
                  </h3>
                  <ul className="list-disc ml-5 mt-2">
                    {developerProfile.previousProjects.map((project, index) => (
                      <ProjectLink
                        key={index}
                        name={project.name}
                        url={project.url}
                      />
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Portfolio:</h3>
                  <a
                    href={developerProfile.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>

              {/* Download button */}
              <div className="md:col-span-2 mt-4">
                <button
                  onClick={handleGenerateFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Download Developer Profile as PDF
                </button>
              </div>
            </div>
          )}
          {/* PWA Features Tab */}
          {activeTab === "pwa" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Progressive Web App Features
              </h2>

              <div className="mb-8">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                  <h3 className="font-medium text-lg text-gray-800 mb-2">
                    App Installation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Install this application on your device for offline access.
                  </p>
                  <button
                    onClick={handleInstallClick}
                    disabled={!installPrompt}
                    className={`w-full py-2 px-4 rounded-md font-medium ${
                      !installPrompt
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {!installPrompt
                      ? "Already Installed or Not Available"
                      : "Install App"}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-lg text-gray-800 mb-2">
                    Push Notifications
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enable notifications to receive updates from the
                    application.
                  </p>
                  <button
                    onClick={handleNotificationClick}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                  >
                    Send Test Notification
                  </button>
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
                <h3 className="text-blue-800 font-medium mb-2">
                  About PWA Features
                </h3>
                <p className="text-blue-700 text-sm">
                  This application demonstrates core PWA capabilities including
                  offline support via service workers, app installation, and
                  push notifications. The code is written with TypeScript and
                  uses modern React patterns.
                </p>
              </div>
            </div>
          )}

          {/* Status messages */}
          {message && (
            <div className="mt-6 p-4 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-blue-700">{message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
