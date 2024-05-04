import * as net from "node:net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("Client connected");
    console.log(data.toString());

    const firstLine = data.toString().split("\r\n")[0];
    const [method, path, version] = firstLine.split(" ");

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n Hello World\r\n");
    } else if (path.startsWith("/echo/")) {
      const echoStr = path.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\nContent-Length: ${echoStr.length}\n\r\n${echoStr}`
      );
    } else {
      socket.write("HTTP/1.1 404 OK\r\n\r\n");
    }
    socket.end();
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

// Uncomment this to pass the first stage
server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
