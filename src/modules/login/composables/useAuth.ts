import { computed, ref, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { showAlert } from "@/composables/useAlerts.ts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/modules/login/store/StoreAuth";
import { storeToRefs } from "pinia";

const errors = ref<string[]>([]);

const login = async (body: any) => {
  const { data } = await ApiService.post("/auth/login", body);
  return data;
};

const logout = async () => {
  const { data } = await ApiService.post("/auth/logout");
  return data;
};

const register = async (body: any) => {
  const { data } = await ApiService.post("/auth/register", body);
  return data;
};

const useAuth = () => {
  const authStore = useAuthStore();
  const { sesion, formValuesAuth } = storeToRefs(authStore);

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authStore.setUser(data);
      showAlert("success", data.meta.message);
      window.location.href = "/";
    },
    onError: (error) => {
      const err = error as any;
      showAlert("error", err.response?.data?.errors?.[0]?.detail || err.message || "Login failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      authStore.cleanSession();
      window.location.href = "/";
    },
    onError: (error) => {
      const err = error as any;
      errors.value.push(err.response?.data?.message || err.message || "Logout failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      authStore.setUser(data);
      showAlert("success", data.meta.message);
      window.location.href = "/";
    },
    onError: (error) => {
      const err = error as any;
      showAlert("error", err.response?.data?.errors?.[0]?.detail || err.message || "Registration failed");
    },
  });

  return {
    sesion,
    formValuesAuth,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isUpdating: computed( () => loginMutation.isPending.value || registerMutation.isPending.value || logoutMutation.isPending.value),
    errors,
  };
};

export default useAuth;
