const admin = require("../firebase/admin");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { fcmToken, title, body, data } = req.body;
  const { screen } = data || {};

  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  res.status(200).json({ success: "Notification scheduled in 5 seconds!" });

  setTimeout(async () => {
    const message = {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
      data: {
        screen: screen,
      },
      android: {
        priority: "high",
        notification: {
          channel_id: "default",
          sound: "default",
        },
      },
    };

    try {
      await admin.messaging().send(message);
      console.log("Notification sent!");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }, 5000);
};
