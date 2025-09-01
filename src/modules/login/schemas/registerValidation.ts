// src/validations/validationSchema.js
import * as yup from 'yup';

export const schema = ({ characters, regex }: { characters: number; regex: RegExp }) => {

  return yup.object().shape({
    // name: yup.string().required('Dato obligatorio').matches(/^[^0-9]+$/, 'Solo letras').max(100, 'Maximo 100 caracteres'),
    email: yup
      .string()
      .required('El dato es obligatorio')
      .email('Porfavor ingrese un formato valido'),
    password: yup.string()
        .min(characters, "Logitud minima de 8 caracteres")
        .matches(regex, "Debe respetar el formato de contraseña")
        .required("La contraseña es necesaria"),
    confirm_password: yup.lazy((value) => {
        return yup.string()
          .when("password", (password, schema) => {
            return schema.test({
              test: (confirm_password) => confirm_password === password[0],
              message: "Las contraseñas deben coincidir",
            });
          })
      }),
  });
}
