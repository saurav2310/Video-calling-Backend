import { Socket } from "socket.io/dist";
import {v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";
const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        // This is will be our unique room id for multiple connections establishments
        const roomId = UUIDv4();
        // Socket connection will join the created room
        socket.join(roomId);

        rooms[roomId] = [];
        // An emit function from server side that server connection has been added to the room
        socket.emit("room-created", {roomId});

    };
    const joinedRoom = ({roomId, peerId}: IRoomParams) => {
        if (rooms[roomId]) {
            console.log("New user has Joined the room: ", roomId, " with peer ID as ", peerId);
            rooms[roomId].push(peerId);
            console.log("added in room", rooms);
            socket.join(roomId);

            socket.on('ready',()=>{
                socket.to(roomId).emit('user-joined',{peerId});
            });

            socket.emit("get-users", {
                participants: rooms[roomId],
                roomId,
            });
        }
    };

    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;