/* eslint-disable no-undef */
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import JwtService from "@/core/services/JwtService";
import ApiService from "@/core/services/ApiService";

// Constantes para claves de localStorage
const LOCAL_STORAGE_USER_KEY = "dataUser";

// Interfaz para tipado del usuario
interface UserData {
  isAuth: boolean;
  user: string | null;
  role: string[];
  id: number | null;
}

// Interfaz para tipado de la respuesta de la API
interface UserResponse {
  data: { 
    attributes: { 
      email: string; 
      id: number; 
      token: string; 
      permissions: string;
      public_key: string;
    } 
  };
}

/**
 * Obtiene los datos de usuario almacenados en localStorage
 */
const getStoreData = (): UserData | null => {
  try {
    return localStorage[LOCAL_STORAGE_USER_KEY] 
      ? JSON.parse(localStorage[LOCAL_STORAGE_USER_KEY]) 
      : null;
  } catch {
    console.warn("Error parsing user data from localStorage");
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const storeData = getStoreData();

  const formValuesAuth = ref({
    email: '',
    password: '',
  });

  const sesion = reactive<UserData>({
    isAuth: storeData?.isAuth || false,
    user: storeData?.user || null,
    role: storeData?.role || ["user"],
    id: storeData?.id || null,
  });

  function setUser(user: UserResponse) {
    sesion.isAuth = true;
    sesion.user = user.data.attributes.email;
    sesion.role = ["user"];
    sesion.id = user.data.attributes.id;

    // Guardar datos en localStorage y JWT
    localStorage[LOCAL_STORAGE_USER_KEY] = JSON.stringify(sesion);
    localStorage.public_key = user.data.attributes.public_key;
    JwtService.saveToken(user.data.attributes.token);
    JwtService.savePermissions(user.data.attributes.permissions);
  }

  /**
   * Limpia la sesión y elimina todos los datos de autenticación
   */
  const cleanSession = () => {
    // Usar métodos específicos en lugar de clear
    JwtService.destroyToken();
    JwtService.destroyPermissions();
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    
    // Reiniciar estado
    sesion.isAuth = false;
    sesion.user = null;
    sesion.role = ["user"];
    sesion.id = null;
  };

  /**
   * Configura los headers de API si hay un token válido
   */
  const setHeaders = () => {
    const token = JwtService.getToken();
    if (token) {
      ApiService.setHeader();
    } else {
      cleanSession();
    }
  };

  return { sesion, setUser, setHeaders, cleanSession, formValuesAuth };
});
