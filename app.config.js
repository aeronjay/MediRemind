export default {
  expo: {
    name: "skill-swap",
    slug: "medicare",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "skillswap",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["background-processing", "background-fetch"],
        NSUserNotificationsUsageDescription: "This app uses notifications to remind you about your medication schedule."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.tebats.medicare",
      permissions: [
        "RECEIVE_BOOT_COMPLETED",
        "SCHEDULE_EXACT_ALARM",
        "USE_EXACT_ALARM",
        "WAKE_LOCK",
        "VIBRATE",
        "POST_NOTIFICATIONS"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#ffffff",
          defaultChannel: "medication-reminders",
          enableBackgroundRefresh: true,
          requestPermissionsImmediately: false,
          iosDisplayInForeground: true
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "a03cf826-0e20-48d1-bf8c-41b6635b60b8"
      }
    },
    owner: "tebats"
  }
};
