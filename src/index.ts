import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import serverConfig from "./config/serverConfig";
import roomHandler from "./handlers/RoomHandler";

const app = express();
app.use(cors());
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

server.listen(serverConfig.PORT, () => {
    console.log(`Server is up on PORT : ${serverConfig.PORT}`);
});
