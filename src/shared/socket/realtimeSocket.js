import { io } from "socket.io-client";
import { getSocketConnectOptions } from "../../utils/apiBaseUrl";

const SOCKET_OPTIONS = {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelayMax: 30000,
};

let socket = null;
let joinedUserId = null;
let subscriberCount = 0;
let disconnectTimer = null;
const eventHandlers = new Map();
const boundSocketEvents = new Set();

const dispatchEvent = (eventName, ...args) => {
  eventHandlers.get(eventName)?.forEach((handler) => handler(...args));
};

const ensureSocket = () => {
  if (socket) return socket;

  const { url, options } = getSocketConnectOptions();
  socket = io(url, { ...options, ...SOCKET_OPTIONS });

  socket.on("connect", () => {
    if (joinedUserId) {
      socket.emit("join", joinedUserId);
    }
    dispatchEvent("__connect");
  });

  socket.on("disconnect", () => {
    dispatchEvent("__disconnect");
  });

  return socket;
};

const bindSocketEvent = (eventName) => {
  if (boundSocketEvents.has(eventName)) return;
  boundSocketEvents.add(eventName);
  ensureSocket().on(eventName, (...args) => dispatchEvent(eventName, ...args));
};

export const acquireRealtimeSocket = (userId) => {
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }

  subscriberCount += 1;
  joinedUserId = userId;

  const activeSocket = ensureSocket();
  if (activeSocket.connected) {
    activeSocket.emit("join", userId);
  }

  return activeSocket;
};

export const releaseRealtimeSocket = () => {
  subscriberCount = Math.max(0, subscriberCount - 1);
  if (subscriberCount > 0) return;

  disconnectTimer = setTimeout(() => {
    if (subscriberCount > 0) return;
    socket?.disconnect();
    socket = null;
    joinedUserId = null;
    boundSocketEvents.clear();
    disconnectTimer = null;
  }, 300);
};

export const subscribeRealtimeEvent = (eventName, handler) => {
  if (!eventHandlers.has(eventName)) {
    eventHandlers.set(eventName, new Set());
  }
  eventHandlers.get(eventName).add(handler);

  if (!eventName.startsWith("__")) {
    bindSocketEvent(eventName);
  }

  return () => {
    eventHandlers.get(eventName)?.delete(handler);
  };
};

export const subscribeRealtimeConnection = (onConnect, onDisconnect) => {
  const handleConnect = () => onConnect?.();
  const handleDisconnect = () => onDisconnect?.();

  const unsubscribeConnect = subscribeRealtimeEvent("__connect", handleConnect);
  const unsubscribeDisconnect = subscribeRealtimeEvent("__disconnect", handleDisconnect);

  if (socket?.connected) {
    handleConnect();
  }

  return () => {
    unsubscribeConnect();
    unsubscribeDisconnect();
  };
};
