/* eslint-disable no-undef */
import { defineStore } from "pinia";
import { ref } from "vue";
import JwtService from "@/core/services/JwtService";
import ApiService from "@/core/services/ApiService";

export const useAuthStore = defineStore("auth", () => {
  const getUser = () => ({
    isAuth: localStorage.dataUser
      ? JSON.parse(localStorage.dataUser).isAuth
      : false,
    user: localStorage.dataUser ? JSON.parse(localStorage.dataUser).user : null,
    role: localStorage.dataUser ? JSON.parse(localStorage.dataUser).role : null,
    id: localStorage.dataUser ? JSON.parse(localStorage.dataUser).id : null,
  });

  const formValuesAuth = ref({
    email: '',
    password: '',
  });

  const sesion = ref(getUser());

  function setUser(user: {
    data: { attributes: { email: any; id: any; token: any; permissions: any } };
  }) {
    sesion.value = {
      isAuth: true,
      user: user.data.attributes.email,
      role: ["user"],
      id: user.data.attributes.id,
    };
    localStorage.dataUser = JSON.stringify(sesion.value);
    JwtService.saveToken(user.data.attributes.token);
    JwtService.savePermissions(user.data.attributes.permissions);
  }

  const cleanSession = () => {
    window.localStorage.clear();
    sesion.value = {
      isAuth: false,
      user: null,
      role: ["user"],
      id: null,
    };
  };

  const setHeaders = () => {
    if (!!JwtService.getToken()) ApiService.setHeader();
    else cleanSession();
  };

  return { sesion, setUser, setHeaders, cleanSession, formValuesAuth };
});
