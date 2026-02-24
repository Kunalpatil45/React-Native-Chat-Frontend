import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;



export async function connectSocket(): Promise<Socket | null> {
    const token = await AsyncStorage.getItem("token");
    
    if (!token)
        throw new Error("no token found . user must login");
    


    if (!socket) {
        socket = io(API_URL, {
            auth: { token },
            
        })

        

        await new Promise((resolve) => {
            
            socket?.on("connect", () => {
                resolve(true);
            })
        })

        socket.on("disconnect", () => {
            console.log("Socket Discconected");
        });
    }

    return socket;

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