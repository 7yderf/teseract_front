# Teseract Frontend

Sistema de gestión de documentos seguro construido con Vue 3, TypeScript y Vite.

## Características

- 🔐 Gestión segura de documentos con cifrado del lado del cliente
- 👥 Capacidad de compartir documentos
- 🔑 Autenticación y autorización de usuarios
- 📱 Diseño responsive con Tailwind CSS
- 🎨 Componentes de formulario personalizados y validaciones
- 🌐 Integración REST API con Axios

## Tecnologías Utilizadas

- Vue 3 con Composition API
- TypeScript
- Vite
- Pinia para gestión de estado
- Vue Query para obtención de datos
- Vue Router
- TailwindCSS
- SCSS
- Vee-Validate + Yup para validaciones de formularios
- CryptoJS para cifrado de documentos
- SweetAlert2 para notificaciones

## Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos y estilos globales
├── components/     # Componentes Vue reutilizables
├── composables/    # Funciones composables de Vue
├── core/          # Servicios principales y utilidades
├── layouts/       # Componentes de diseño de página
├── modules/       # Módulos de características
├── router/        # Configuraciones de rutas
├── store/         # Stores de Pinia
└── views/         # Componentes de página
```

## Comenzando

1. Clonar el repositorio:

```bash
git clone https://github.com/7yderf/teseract_front/
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en el directorio raíz con las variables de entorno requeridas:

```env
VITE_SERVER_APP_TOKEN=tu_token
VITE_SERVER_APP_IV=tu_iv
```

4. Iniciar servidor de desarrollo:

```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run lint` - Ejecutar ESLint
- `npm run preview` - Vista previa de la compilación de producción

## Implementación de Características Principales

### Seguridad de Documentos
Los documentos se cifran del lado del cliente antes de la carga usando cifrado AES:
- Clave de cifrado única generada por documento
- Claves almacenadas de forma segura en localStorage
- Vector de Inicialización (IV) utilizado para seguridad adicional

### Autenticación
- Autenticación basada en JWT
- Control de acceso basado en roles
- Sesiones persistentes
- Requisitos seguros de contraseña

### Componentes de Formulario
Componentes de formulario personalizados con características como:
- Etiquetas flotantes
- Validación de entrada
- Indicador de fortaleza de contraseña
- Inputs personalizados de selección
- Manejo de carga de archivos

## Personalización del Proyecto

### Estilos
- Estilos globales en `src/assets/scss/style.scss`
- Configuración personalizada de Tailwind en `tailwind.config.js`
- Variables CSS para temas en `:root`

### Configuración del Entorno
Configurar variables de entorno en `.env`:
```env
VITE_SERVER_APP_TOKEN=tu_token
VITE_SERVER_APP_IV=tu_iv
```

## Buenas Prácticas

- TypeScript para seguridad de tipos
- Composición de componentes usando Vue 3 Composition API
- Arquitectura modular para escalabilidad
- Manejo consistente de errores
- Patrones de diseño responsive
- Enfoque centrado en la seguridad

## Contribución

1. Hacer fork del repositorio
2. Crear tu rama de características (`git checkout -b feature/CaracteristicaIncreible`)
3. Hacer commit de tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abrir un Pull Request
