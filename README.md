# CalenConnect UI

<p align="center">
  <img src="https://vitejs.dev/logo.svg" width="120" alt="Vite Logo" />
</p>

## 📌 Descripción del Proyecto

CalenConnect UI es una aplicación frontend moderna desarrollada con React y TypeScript que proporciona una interfaz de usuario intuitiva y elegante para la gestión de calendarios, disponibilidad y citas. La aplicación está construida siguiendo las mejores prácticas de desarrollo web moderno y principios de diseño UI/UX.

## 🎯 Objetivo y Alcance

### Objetivo General

Proporcionar una interfaz de usuario moderna, accesible y responsive que permita a los usuarios gestionar eficientemente sus calendarios y citas.

### Objetivos Específicos

- Ofrecer una experiencia de usuario fluida y agradable
- Facilitar la gestión de perfiles y preferencias de calendario
- Permitir la visualización y gestión de períodos de disponibilidad
- Proporcionar herramientas intuitivas para la creación y gestión de citas
- Implementar un diseño responsive que funcione en todos los dispositivos

### Público Objetivo

- Profesionales que necesitan gestionar su agenda
- Usuarios que buscan programar citas o servicios
- Empresas que requieren un sistema de gestión de citas

## 📂 Estructura del Proyecto

```
calenconnect-ui/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios y llamadas a API
│   ├── store/         # Estado global
│   ├── types/         # Definiciones de tipos
│   ├── utils/         # Utilidades y helpers
│   └── App.tsx        # Componente principal
├── public/            # Archivos estáticos
└── config/            # Archivos de configuración
```

## ⚙️ Requisitos Previos

Para ejecutar este proyecto, necesitarás:

- Node.js (v18 o superior)
- npm (v8 o superior) o pnpm
- Conexión a Internet para las dependencias

## 🚀 Instrucciones de Instalación y Ejecución

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd calenconnect-ui
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus propias credenciales.

### Ejecución

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

La aplicación estará disponible en: `http://localhost:5173`

## 🛠 Tecnologías Principales

- **Vite**: Herramienta de construcción y desarrollo
- **React**: Biblioteca para construcción de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework de utilidades CSS
- **shadcn/ui**: Componentes de UI reutilizables
- **React Router**: Enrutamiento de la aplicación
- **Axios**: Cliente HTTP para peticiones API

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas con coverage
npm run test:coverage
```

## 🛠 Guía de Contribución

Agradecemos todas las contribuciones. Para contribuir:

1. **Fork** del repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios siguiendo las convenciones de código
4. **Commit** tus cambios (siguiendo Conventional Commits)
5. **Push** a la rama (`git push origin feature/amazing-feature`)
6. Abre un **Pull Request**

### Convenciones de Commits

Seguimos las convenciones de Conventional Commits:

```
<tipo>(<ámbito opcional>): <descripción>

[Descripción extendida opcional]

[Referencias opcionales a issues]
```

Tipos principales:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato
- `refactor`: Refactorización de código
- `test`: Cambios en pruebas
- `chore`: Tareas de mantenimiento

## 🚀 Despliegue

Para desplegar la aplicación:

1. Construye la aplicación:
   ```bash
   npm run build
   ```

2. El resultado de la construcción estará en el directorio `dist/`

3. Despliega el contenido del directorio `dist/` en tu servidor web preferido

## 🙋‍♂️ Soporte

Si necesitas ayuda:
- Abre un issue en el repositorio
- Consulta la documentación en `/docs`
- Contacta al equipo de desarrollo

---

Desarrollado con ❤️ usando [React](https://reactjs.org/) y [Vite](https://vitejs.dev/)
