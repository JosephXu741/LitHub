import io from "socket.io-client";
const SOCKET_URL = "ws://localhost:8080";

export const socket = io(SOCKET_URL);
