import { Server } from "socket.io";

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://ms-crm.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join room", (roomId, user) => {
      // console.log(roomId, user);
      if (roomId && user) {
        socket.join(roomId);
        io.to(roomId).emit("user joined", `${user} is online`);
      } else {
        console.log("Invalid roomId or user");
      }
    });

    socket.on("leave room", (roomId, user) => {
      // console.log(roomId, user);
      if (roomId && user) {
        socket.leave(roomId);
        io.to(roomId).emit("user left", `${user} is offline`);
      } else {
        console.log("Invalid roomId or user");
      }
    });

    socket.on(
      "chat message",
      (roomId, content, sender, reciever, chatId, createdAt) => {
        // console.log("socket: ", sender, reciever);
        if (roomId && content && sender) {
          io.to(roomId).emit(
            "chat message",
            content,
            sender,
            reciever,
            chatId,
            createdAt
          );
        } else {
          console.error("Invalid roomId or message");
        }
      }
    );
  });

  return io;
};

export default configureSocket;
