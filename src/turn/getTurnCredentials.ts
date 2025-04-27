import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const TURN_SECRET = process.env.TURN_SECRET || "";

// Match this with static-auth-secret in Coturn config
const TURN_URI = "turn:13.61.182.25:3478";
// Replace with your actual TURN server URI

export const getTurnCredentials = ( res: express.Response) => {
    try {
      if (!TURN_SECRET) {
        throw new Error("TURN_SECRET is not configured");
      }

      const ttl = 3600;
      const unixTimeStamp = Math.floor(Date.now() / 1000) + ttl;
      const username = `${unixTimeStamp}`;
      const hmac = crypto.createHmac("sha1", TURN_SECRET)
                        .update(username)
                        .digest("base64");

      res.status(200).json({
        iceServers: [{
          credential: hmac,
          urls: [TURN_URI],
          username,
        }],
      });
    } catch (error) {
      console.error("Error generating TURN credentials:", error);
      res.status(500).json({ error: "Failed to generate TURN credentials" });
    }
  };
