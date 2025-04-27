import cors from "cors";
import crypto from "crypto";
import express, {Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import serverConfig from "./config/serverConfig";
import roomHandler from "./handlers/RoomHandler";

const TURN_SECRET = process.env.TURN_SECRET || "";

// Match this with static-auth-secret in Coturn config
const TURN_URI = "turn:13.61.182.25:3478";

const app = express();
app.use(cors());
app.use(express.json());
express.urlencoded({ extended: true });
const server = http.createServer(app);
const io =  new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New user connected");
    roomHandler(socket);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

app.get("/turn-credentials", (req: Request, res: Response) => {
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
      console.log(req.url);

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
  });

server.listen(serverConfig.PORT, () => {
    console.log(`Server is up on PORT : ${serverConfig.PORT}`);
});
