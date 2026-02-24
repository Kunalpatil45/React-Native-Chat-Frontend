import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {

        return;
    }

    if (off) {
        socket.off("testSocket", payload);
    }
    else if (typeof payload == "function") {
        socket.on("testSocket", payload);
    }
    else {
        socket.emit("testSocket", payload);
    }

}

export const UpdateProfile = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {

        return;
    }

    if (off) {
        socket.off("updateProfile", payload);
    }
    else if (typeof payload == "function") {
        socket.on("updateProfile", payload);
    }
    else {
        socket.emit("updateProfile", payload);
    }

}

export const getContacts = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {

        return;
    }

    if (off) {
        socket.off("getContacts", payload);
    }
    else if (typeof payload == "function") {
        socket.on("getContacts", payload);
    }
    else {
        socket.emit("getContacts", payload);
    }

}

export const newConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    console.log("newConversation", payload);
    if (!socket) {

        return;
    }

    if (off) {
        socket.off("newConversation", payload);
    }
    else if (typeof payload == "function") {
        socket.on("newConversation", payload);
    }
    else {
        socket.emit("newConversation", payload);
    }

}

export const getConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {

        return;
    }

    if (off) {
        socket.off("getConversation", payload);
    }
    else if (typeof payload == "function") {
        socket.on("getConversation", payload);
    }
    else {
        socket.emit("getConversation", payload);
    }

}

export const newMesaage = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {

        return;
    }

    if (off) {
        socket.off("newMessage", payload);
    }
    else if (typeof payload == "function") {

        socket.on("newMessage", payload);
    }
    else {
        socket.emit("newMessage", payload);
    }

}


export const getMessage = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {

        return;
    }

    if (off) {

        socket.off("getMessage", payload);
    }
    else if (typeof payload == "function") {

        socket.on("getMessage", payload);
    }
    else {

        socket.emit("getMessage", payload);
    }

}