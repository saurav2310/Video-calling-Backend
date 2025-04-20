import { Socket } from "socket.io/dist";
import {v4 as UUIDv4 } from "uuid";

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        // This is will be our unique room id for multiple connections establishments
        const roomId = UUIDv4();
        // Socket connection will join the created room
        socket.join(roomId);
        // An emit function from server side that server connection has been added to the room
        socket.emit("room-created", {roomId});
        
    };
    const joinedRoom = ({roomId}:{roomId:string}) => {
         console.log("New user has Joined the room: ",roomId);
    };

    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;