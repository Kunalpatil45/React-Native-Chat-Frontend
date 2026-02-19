import { API_URL } from "@/constants";
import axios from "axios"


export const login = async(
    email:string,
    password:string
    ):Promise<{token:string}> => {
    try{
        console.log("LOGIN URL EXACT:", `${API_URL}/login`);
        const response = await axios.post(`${API_URL}/login`,{
            email,
            password
        })
        return response.data;
    }catch(error:any)
    {
        console.log("ERROR OCCUR",error);
        const msg = error?.response?.data?.msg || "Login Failed";   
        throw new Error(msg);
    }
}


export const register = async(
    email:string,
    password:string,
    name:string,
    avatar?:string | null
    ):Promise<{token:string}> => {
    try{
        console.log("reached here :",API_URL);

        const response = await axios.post(`${API_URL}/register`,{
            email,
            password,
            name,
            avatar
        })
        return response.data;
    }catch(error:any)
    {
        console.log("ERROR OCCUR",error);
        const msg = error?.response?.data?.msg || "Registration Failed";   
        throw new Error(msg);
    }
}