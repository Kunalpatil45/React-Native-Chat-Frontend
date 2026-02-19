import { getSocket } from "./socket";

export const testSocket = (payload:any , off:boolean = false)=>{
    const socket = getSocket();

    if(!socket)
    {
        console.log("");
        return;
    }

    if(off)
    {
        socket.off("testSocket", payload);
    }
    else if(typeof payload == "function")
    {
        socket.on("testSocket",payload);
    }
    else
    {
        socket.emit("testSocket",payload);
    }

}

export const UpdateProfile = (payload:any , off:boolean = false)=>{
    const socket = getSocket();
    
    if(!socket)
    {
        console.log("");
        return;
    }

    if(off)
    {
        socket.off("updateProfile", payload);
    }
    else if(typeof payload == "function")
    {
        socket.on("updateProfile",payload);
    }
    else
    {
        socket.emit("updateProfile",payload);
    }

}

export const getContacts = (payload:any , off:boolean = false)=>{
    const socket = getSocket();
    
    if(!socket)
    {
        console.log("");
        return;
    }

    if(off)
    {
        socket.off("getContacts", payload);
    }
    else if(typeof payload == "function")
    {
        socket.on("getContacts",payload);
    }
    else
    {
        socket.emit("getContacts",payload);
    }

}

export const newConversation = (payload:any , off:boolean = false)=>{
    const socket = getSocket();
    console.log("hi am newConversation")
    if(!socket)
    {
        console.log("");
        return;
    }

    if(off)
    {
        socket.off("newConversation", payload);
    }
    else if(typeof payload == "function")
    {
        socket.on("newConversation",payload);
    }
    else
    {
        socket.emit("newConversation",payload);
    }

}

export const getConversation = (payload:any , off:boolean = false)=>{
    const socket = getSocket();
    console.log("hi am getConversation")
    if(!socket)
    {
        console.log("");
        return;
    }

    if(off)
    {
        socket.off("getConversation", payload);
    }
    else if(typeof payload == "function")
    {
        socket.on("getConversation",payload);
    }
    else
    {
        socket.emit("getConversation",payload);
    }

}