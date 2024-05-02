import * as net from "node:net";

const server = net.createServer((socket) => {
  console.log("Client connected");
  socket.on("data", (data) => {
    console.log(data.toString());
    socket.write("HTTP/1.1 200 OK\r\n\r\n");
    socket.end();
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
  // socket.end();
});

// Uncomment this to pass the first stage
server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
