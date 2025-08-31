// src/validations/validationSchema.js
import * as yup from 'yup';

export const schema = () => {

  return yup.object().shape({
     email: yup
      .string()
      .required('El dato es obligatorio')
      .email('Porfavor ingrese un formato valido'),
    password: yup.string().required('El dato es obligatorio'),
  });
}
