import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;
let statusListeners = [];

const notifyStatus = (status) => {
  statusListeners.forEach((fn) => fn(status));
};

/**
 * Initialize reusable Socket.IO connection for authenticated user
 */
export const initSocket = (token) => {
  const jwtToken =
    token ||
    localStorage.getItem("sf_jwt_token") ||
    sessionStorage.getItem("sf_jwt_token");

  if (!jwtToken) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    notifyStatus("disconnected");
    return null;
  }

  // Reuse active socket if connected
  if (socket && socket.connected) {
    notifyStatus("connected");
    return socket;
  }

  // Clean existing socket if present
  if (socket) {
    socket.disconnect();
  }

  notifyStatus("connecting");

  socket = io(SOCKET_URL, {
    auth: {
      token: jwtToken,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket.IO Client] Connected with ID:", socket.id);
    notifyStatus("connected");
  });

  socket.on("connect_error", (err) => {
    console.warn("[Socket.IO Client] Connection error:", err.message);
    notifyStatus("reconnecting");
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket.IO Client] Disconnected:", reason);
    notifyStatus("disconnected");
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  notifyStatus("disconnected");
};

export const subscribeConnectionStatus = (callback) => {
  statusListeners.push(callback);
  if (socket && socket.connected) {
    callback("connected");
  } else if (socket) {
    callback("connecting");
  } else {
    callback("disconnected");
  }
  return () => {
    statusListeners = statusListeners.filter((fn) => fn !== callback);
  };
};
