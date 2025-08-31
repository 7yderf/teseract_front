import CryptoJS from "crypto-js";

const ID_TOKEN_KEY = "id_token";
const ID_PERMISSIONS_KEY = "permissions";

/**
 * @description get token from localStorage
 */
export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveUser = (user: any) => {
  window.localStorage.setItem("user", JSON.stringify(user));
};

/**
 * @description save token into localStorage
 * @param token
 */
export const saveToken = (token: string) => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token from localStorage
 */
export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * @description get the user permissions from localStorage
 */
export const getPermissions = () => {
  return window.localStorage.getItem(ID_PERMISSIONS_KEY);
};

/**
 * @description save the user permissions into localStorage
 * @param permissions
 */
export const savePermissions = (permissions: string) => {
  window.localStorage.setItem(ID_PERMISSIONS_KEY, permissions);
};

/**
 * @description remove the user permissions from localStorage
 */
export const destroyPermissions = () => {
  window.localStorage.removeItem(ID_PERMISSIONS_KEY);
};

export const hasPermissionTo = (permission: string) => {
  const permissions = decipherPermissions();

  if (permissions.includes(permission)) {
    return true;
  }

  return false;
};

const decipherPermissions = () => {
  const permissionsPayload = window.localStorage.getItem(ID_PERMISSIONS_KEY);
  let Utf8 = CryptoJS.enc.Utf8;

  // Asegúrate de reemplazar estas variables con valores reales en tu entorno JS
  const $secret_key = process.env.VITE_SERVER_APP_TOKEN ?? "";
  const $secret_iv = process.env.VITE_SERVER_APP_IV ?? "";

  if (!$secret_key || !$secret_iv) {
    throw new Error(
      "Secret key or IV is not defined in environment variables."
    );
  }

  if (!permissionsPayload) {
    return "";
  }

  const key = CryptoJS.SHA256($secret_key)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 32);

  let iv = CryptoJS.SHA256($secret_iv)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 16);

  const encrypt = CryptoJS.enc.Base64.parse(permissionsPayload).toString(
    CryptoJS.enc.Utf8
  );

  const decrypt = CryptoJS.AES.decrypt(encrypt, Utf8.parse(key), {
    iv: Utf8.parse(iv),
  }).toString(Utf8);

  return decrypt;
};

export default {
  getToken,
  saveUser,
  saveToken,
  destroyToken,
  getPermissions,
  savePermissions,
  destroyPermissions,
  hasPermissionTo,
};
