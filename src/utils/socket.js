import { Server } from "socket.io";

const intialiseSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Handle events here 
        socket.on("join-chat", ({firstName,userId,targetUserId}) => {
            const roomId = [userId,targetUserId].sort().join("_"); // You can customize room naming as needed [{userId}-{targetUserId}].join("_")
            
            console.log(`${firstName} User joined chat at roomid ${roomId}`);
            socket.join(roomId);
        });

        // When a user sends a message
        socket.on("send-message", ({
            firstName,      // Name of the person sending
            from: userId,   // ID of sender
            to: targetUserId, // ID of receiver
            text: message    // The actual message text
        }) => {
            // Create a unique room ID by combining both user IDs
            // .sort() ensures the room ID is always the same regardless of who sends first
            // Example: user1_user2 (alphabetically sorted)
            const roomId = [userId, targetUserId].sort().join("_");
            
            console.log(`${firstName} sent: "${message}" in room ${roomId}`);
            
            // Broadcast the message to everyone in the room (both sender and receiver)
            // This ensures both people see the message appear in real-time
            io.to(roomId).emit("receive-message", {
                firstName,
                message,
                sender: userId // Who sent it (so we can show "me" vs "other")
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

export default intialiseSocket;