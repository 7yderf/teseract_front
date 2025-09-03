import CryptoJS from "crypto-js";
//import process from "process";


const ID_TOKEN_KEY = "id_token";
const ID_PERMISSIONS_KEY = "permissions";
const PRIVATE_KEY_STORAGE = "private_key";

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

  // Obtener variables de entorno usando import.meta.env
  const $secret_key = import.meta.env.VITE_SERVER_APP_TOKEN ?? "";
  const $secret_iv = import.meta.env.VITE_SERVER_APP_IV ?? "";

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

/**
 * @description Encrypts the private key using environment variables as encryption keys
 * @param privateKey The private key to encrypt
 * @returns encrypted private key string
 */
export const encryptPrivateKey = (privateKey: string): string => {
  console.log('🚀 ~ encryptPrivateKey ~ privateKey:', privateKey)
  let Utf8 = CryptoJS.enc.Utf8;
  
  const $secret_key = import.meta.env.VITE_SERVER_APP_TOKEN ?? "";
  const $secret_iv = import.meta.env.VITE_SERVER_APP_IV ?? "";

  if (!$secret_key || !$secret_iv) {
    throw new Error("Secret key or IV is not defined in environment variables.");
  }

  if (!privateKey) {
    throw new Error("Private key is required for encryption.");
  }

  // Generate encryption key and IV using the same method as permissions
  const key = CryptoJS.SHA256($secret_key)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 32);

  const iv = CryptoJS.SHA256($secret_iv)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 16);

  // Encrypt the private key
  const encrypted = CryptoJS.AES.encrypt(privateKey, Utf8.parse(key), {
    iv: Utf8.parse(iv),
  });

  // Store the encrypted result
  window.localStorage.setItem(PRIVATE_KEY_STORAGE, encrypted.toString());
  
  return encrypted.toString();
};

/**
 * @description Decrypts the stored private key using environment variables
 * @returns decrypted private key string
 * @throws Error if private key is not found or if decryption fails
 */
export const decryptPrivateKey = (): string => {
  const encryptedKey = window.localStorage.getItem(PRIVATE_KEY_STORAGE);
  let Utf8 = CryptoJS.enc.Utf8;

  const $secret_key = import.meta.env.VITE_SERVER_APP_TOKEN ?? "";
  const $secret_iv = import.meta.env.VITE_SERVER_APP_IV ?? "";

  if (!$secret_key || !$secret_iv) {
    throw new Error("Secret key or IV is not defined in environment variables.");
  }

  if (!encryptedKey) {
    throw new Error("No encrypted private key found in storage.");
  }

  const key = CryptoJS.SHA256($secret_key)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 32);

  const iv = CryptoJS.SHA256($secret_iv)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 16);

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedKey, Utf8.parse(key), {
      iv: Utf8.parse(iv),
    });

    const privateKey = decrypted.toString(Utf8);

    if (!privateKey) {
      throw new Error("Failed to decrypt private key.");
    }

    return privateKey;
  } catch (error) {
    console.error("Error decrypting private key:", error);
    throw new Error("Failed to decrypt private key. Please try logging in again.");
  }
};

/**
 * @description Removes the encrypted private key from localStorage
 */
export const destroyPrivateKey = () => {
  window.localStorage.removeItem(PRIVATE_KEY_STORAGE);
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
  encryptPrivateKey,
  decryptPrivateKey,
  destroyPrivateKey,
};
