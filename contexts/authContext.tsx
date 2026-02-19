import { AuthContextProps, DecodedTokenProps, UserProps } from "@/type";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"
import { login, register } from "@/Services/authServices";
import { connectSocket, disconnectSocket } from "../socket/socket";

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    updateToken: async () => { },

});




export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadToken();
    }, [])

    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem("token")
        console.log("stored token",storedToken);
        if (storedToken) {
            try {
                const decoded = jwtDecode<DecodedTokenProps>(storedToken);
                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    await AsyncStorage.removeItem("token");
                    goToWelcome();
                    return;
                }

                setToken(storedToken);
                await connectSocket();
                setUser(decoded.user);

                goToHomePage();
            }
            catch (error) {
                goToWelcome();
                console.log("failed to decode token ", error);
            }
        }
        else {
            goToWelcome();
        }
    }


    const goToHomePage = () => {
        setTimeout(() => {
            router.replace('/(main)/home');
        }, 3000);
    };

    const goToWelcome = () => {
        setTimeout(() => {
            router.replace('/(auth)/login');
        }, 3000);
    }

    const updateToken = async (token: string) => {
        if (token) {
            console.log("token is there",token);
            setToken(token);
            await AsyncStorage.setItem("token", token);
            const decoded = jwtDecode<DecodedTokenProps>(token);
            console.log("decoded codw ", decoded);
            setUser(decoded.user);

        }
    }

    const signIn = async (email: string, password: string) => {
        console.log("Login reached signIn");
        const response = await login(email, password);
        await updateToken(response.token);
        await connectSocket();
        router.replace("/(main)/home");
    }

    const signUp = async (email: string, password: string, name: string, avatar?: string | null) => {
        console.log("Login reached signUn");
        const response = await register(email, password, name, avatar);
        await updateToken(response.token);
        router.replace("/(auth)/login");
    }

    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        disconnectSocket();
        router.replace("/(auth)/login");

    };



    return (
        <AuthContext.Provider value={{ token, user, signUp, signIn, updateToken, signOut }}>
            {children}
        </AuthContext.Provider>
    );

};


export const useAuth = () => useContext(AuthContext);