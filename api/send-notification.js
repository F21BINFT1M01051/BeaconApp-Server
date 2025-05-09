require("dotenv").config();
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_CERT_URL,
  }),
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-notification", async (req, res) => {
  try {
    const { fcmToken, title, body, data } = req.body;
    const { screen } = data || {};

    if (!fcmToken || !title || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    res.status(200).json({ success: "Notification scheduled in 1 minute!" });

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
        console.log("Notification sent after 10-seconds delay!");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }, 5000);
  } catch (error) {
    console.error("Error in /send-notification endpoint:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = app;  
