import * as net from "node:net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("Client connected");
    console.log(data.toString());
    const firstLine = data.toString().split("\r\n")[0];
    const [method, path, version] = firstLine.split(" ");
    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      return;
    }

    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
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
