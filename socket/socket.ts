import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;



export async function connectSocket(): Promise<Socket | null> {

  try {

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("No token found, skipping socket connection");
      return null;
    }

    if (!socket) {

      socket = io(API_URL, {
        auth: { token },
        timeout: 5000,          // stop trying after 5s
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("connect_error", (err) => {
        console.log("Socket connection failed (offline maybe)");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

    }

    return socket;

  } catch (err) {

    console.log("Socket init error", err);
    return null;

  }
}

export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}