import { ref } from "vue";
import useAuth from '@/modules/login/composables/useAuth';
import { useRouter } from "vue-router"; 
import { alertDefault } from "@/composables/useAlerts.ts";

export function useErrorHandler() {
  const { logout } = useAuth(); // Ahora está dentro de un composable
  const router = useRouter();

  const handleError = (err: any) => {
    const errors = ref<any[]>([])

    if (err.message == 'Request failed with status code 500') {
      errors.value = [{ detail: 'Error en el servidor, intente más tarde', status: 500 }];
      alertDefault('Error en el servidor', errors.value[0].detail, 'error', 3000)
    } else if (err.response?.status == 401 || err.response?.status == 403) {
      alertDefault('No autorizado', 'La sesión ha expirado', 'error', 3000)
      localStorage.clear();
      logout();
      router.push({ name: "sign-in" });
    } else {
      errors.value = err.response?.data?.errors || [];
    }

    return errors.value;
  }

  return {
    handleError
  }
}



// function handleErrorResponse(err: ErrorResponse) {
//   if (err.message == 'Request failed with status code 500') {
//     errors.value = [{ detail: 'Error en el servidor, intente más tarde', status: 500 }];
//   } else if (err.response.status == 401 || err.response.status == 403) {
//     authStore.logout();
//     router.push({ name: "sign-in" });
//     geneticAlert('No autorizado', 'La sesión ha expirado', 'error', 3000)
//   } else {
//     errors.value = err.response.data.errors || [];
//   }
// }