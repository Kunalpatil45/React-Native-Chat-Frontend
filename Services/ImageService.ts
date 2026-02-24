import { CLOUDNARY_CLOUD_NAME, CLOUDNARY_IMAGE_PRESET } from "@/constants";
import { ResponseProps } from "@/type";
import axios from "axios";

const CLOUNDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDNARY_CLOUD_NAME}/image/upload`

export const uploadFileToCloudnary = async (
    file: { uri?: string } | string,
    folderName: string
): Promise<ResponseProps> => {
    try {
        if (!file) return { success: true, data: null };
        console.log("reached inside cloudnary ()");
        if (typeof file == "string") return { success: true, data: file }

        if (file && file.uri) {
            const formData = new FormData();
            console.log("reached inside cloudnary () 1");
            formData.append("file", {
                uri: file?.uri,
                type: "image/jpeg",
                name: file?.uri?.split('/').pop() || "file.jpeg"

            } as any);
            console.log("reached inside cloudnary () 2");
            formData.append("upload_preset", CLOUDNARY_IMAGE_PRESET);
            formData.append("folder", folderName);

            console.log("reached inside cloudnary () 3");
            const response = await axios.post(CLOUNDINARY_API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });



            return { success: true, data: response?.data?.secure_url };

        }
        return { success: true, data: null }
    }
    catch (err: any) {

        return {
            success: false,
            msg: err.message || "Could Not Upload File ",
        }
    }
}

export const getAvatarPath = (file: any, isGroup = false) => {
    if (file && typeof file == 'string') return file;

    if (file && typeof file == "object") return file.uri;

    if (isGroup) return require("../assets/images/default.png");

    return require("../assets/images/default.png")

}