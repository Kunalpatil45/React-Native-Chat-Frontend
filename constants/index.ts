/* import Constants from "expo-constants";
import { Platform } from "react-native";


const host = Constants.expoConfig?.hostUri?.split(":")[0];

export const API_URL =
  Platform.OS === "android"
    ? `http://${host}:3000`
    : "http://localhost:3000";

console.log("API_URL =", API_URL);


export const CLOUDNARY_CLOUD_NAME = "dvvy1wzof";
export const CLOUDNARY_IMAGE_PRESET = "Images" */


import { Platform } from "react-native";

// 🔴 PRODUCTION BACKEND
const PROD_API = "https://kchat-7o52.onrender.com";

// 🟡 LOCAL DEV BACKEND (optional for testing)
const DEV_API = "http://localhost:3000";

// change this flag when needed
const USE_PROD = true;

export const API_URL = USE_PROD ? PROD_API : DEV_API;

console.log("API_URL =", API_URL);

export const CLOUDNARY_CLOUD_NAME = "dvvy1wzof";
export const CLOUDNARY_IMAGE_PRESET = "Images";