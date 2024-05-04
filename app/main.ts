import * as net from "node:net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("Client connected");
    console.log(data.toString());

    const [fLine, ...rest] = data.toString().split("\r\n");
    const [method, path, version] = fLine.split(" ");

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n Hello World\r\n");
    } else if (path.startsWith("/echo/")) {
      const echoStr = path.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\nContent-Length: ${echoStr.length}\n\r\n${echoStr}`
      );
    } else if (path === "/user-agent") {
      const userAgent = rest
        .find((line) => line.startsWith("User-Agent"))
        .split(": ")[1]
        .trim();
      console.log(userAgent, "userAgent");
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\nContent-Length: ${userAgent.length}\n\r\n${userAgent}`
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
