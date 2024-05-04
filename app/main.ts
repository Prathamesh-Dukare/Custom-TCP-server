import * as net from "node:net";
import fs from "node:fs";
import { join } from "node:path";

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
        ?.find((line) => line.startsWith("User-Agent"))
        ?.split(": ")[1]
        .trim();

      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\nContent-Length: ${
          userAgent?.length ?? 0
        }\n\r\n${userAgent}`
      );
    } else if (path.startsWith("/files/")) {
      const fileName = path.split("/files/")[1];
      const dirName = process.argv.slice(2)[1];

      // * reading a file from server
      if (method === "GET") {
        try {
          const fileContents = fs.readFileSync(
            join(dirName, fileName),
            "utf-8"
          );
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\nContent-Length: ${fileContents.length}\n\r\n${fileContents}`
          );
        } catch (e) {
          console.log(e);
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
      }
      // * wriring a file into server
      else if (method === "POST") {
        const fileContents = rest[rest.length - 1].trim();
        console.log(fileContents, "fileContents");

        fs.writeFileSync(join(dirName, fileName), fileContents);
        socket.write("HTTP/1.1 201 Created \r\n\r\n");
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
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
