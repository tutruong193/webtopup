import { jwtDecode } from "jwt-decode";
export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


export const jwtTranslate = (cookiesAccessToken) => {
    if (!cookiesAccessToken || !cookiesAccessToken.access_token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(cookiesAccessToken.access_token);
        return decodedToken;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};
