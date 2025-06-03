const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Publicフォルダ内の静的ファイルを提供
app.use(express.static(path.join(__dirname, "public")));

// ルートアクセス時にavatar.htmlを返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "avatar.html"));
});

// WebSocket設定
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("send_my_pos", (data) => {
    console.log(`Received send_my_pos from ${socket.id}`);
    socket.broadcast.emit("update_your_pos", [
      socket.id,
      data[0],
      data[1],
      data[2],
      data[3],
    ]);
  });

  socket.on("expressionUpdate", (data) => {
    try {
      if (data && typeof data.expression === "string" && data.id) {
        console.log(`Received expressionUpdate from ${socket.id}:`, data);
        socket.broadcast.emit("update_expression", data);
      } else {
        console.warn("Invalid expressionUpdate data received:", data);
      }
    } catch (error) {
      console.error("Error handling expressionUpdate:", error);
    }
  });

  socket.on("languageData", (data) => {
    try {
      if (data && typeof data.text === "string") {
        console.log(`Received languageData from ${socket.id}:`, data.text);
        socket.broadcast.emit("update_language_data", {
          id: socket.id,
          text: data.text,
        });
      } else {
        console.warn("Invalid languageData received:", data);
      }
    } catch (error) {
      console.error("Error handling languageData:", error);
    }
  });

  // 表情変化の受信処理（原因を識別）
  socket.on("expressionChange", (data) => {
    try {
      if (data && typeof data.expression === "string") {
        const source = data.source || "unknown"; // デフォルトで"unknown"に設定
        console.log(
          `Received expressionChange from ${socket.id} (source: ${source}):`,
          data.expression
        );
        // 他のクライアントに通知
        socket.broadcast.emit("update_expression", {
          id: socket.id,
          expression: data.expression,
          source: source,
        });
      } else {
        console.warn("Invalid expressionChange data received:", data);
      }
    } catch (error) {
      console.error("Error handling expressionChange:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    socket.broadcast.emit("remove_user", socket.id);
  });
});


// サーバーの起動設定
const PORT = 3001; // 必要に応じて変更可能
const HOST = "127.0.0.1"; // ローカルホストに戻す

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
}).on("error", (err) => {
  console.error(`Failed to start server on port ${PORT}:`, err);
});
