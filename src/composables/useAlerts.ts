import Swal from "sweetalert2";

const optionsSweet = {
  toast: {
    position: "top-end",
    toast: true,
    didOpen: (toast: {
      addEventListener: (
        arg0: string,
        arg1: { (): number | undefined; (): number | undefined }
      ) => void;
    }) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  },
};

export function showAlert(
  type: "success" | "error" | "warning",
  message = null,
  timer = 4000
) {
  const options = {
    success: {
      icon: "success",
      title: "¡Listo!",
      text: message || "Operación realizada con éxito",
      timer,
      confirmButtonText: "Listo",
      confirmButtonColor: "green",
      showConfirmButton: !timer,
      timerProgressBar: !!timer,
      ...optionsSweet.toast,
    },
    error: {
      icon: "error",
      title: "Error",
      text: message || "Algo salió mal, por favor intenta de nuevo",
      timer,
      confirmButtonText: "Entiendo",
      confirmButtonColor: "red",
      showConfirmButton: !timer,
      timerProgressBar: !!timer,
      ...optionsSweet.toast,
    },
    warning: {
      icon: "warning",
      title: "¡Atención!",
      text: message || "Por favor verifica los datos ingresados",
      timer,
      confirmButtonText: "Ok",
      confirmButtonColor: "orange",
      showConfirmButton: !timer,
      timerProgressBar: !!timer,
      ...optionsSweet.toast,
    },
  };

  // si timer es null, no se cerrará automáticamente
  if (!timer) delete (options[type] as any).timer;
  if (!timer) delete (options[type] as any).didOpen;

  return Swal.fire(options[type] as any);
}

export async function showConfirm(
  message = "¿Estás seguro de realizar esta acción?",
  confirmText = "Sí, estoy seguro"
) {
  const result = await Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: "green",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "red",
  });
  return result;
}

export async function alertDefault(title= 'Algo salió mal, por favor intente de nuevo.', message: any, type: any, timer = 5000) {
  return Swal.fire({
    icon: type,
    title: title,
    text: message,
    timer,
    confirmButtonText: 'Entiendo',
    heightAuto: false,
    customClass: {
      confirmButton: "btn fw-semibold btn-light-danger",
    },
  })
}

export default { showAlert, showConfirm, alertDefault };
