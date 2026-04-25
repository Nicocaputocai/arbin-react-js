# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Para generar la app con Capacitor para android:
Si no existe la carpeta android primero:
npx cap add android

Si ya existe:
npx cap sync android
npx cap open android

Hay que tener Android Studio instalado.

Luego en Android Studio hacer click en el elefante que tiene una flecha apuntando para abajo, entre la lupa y el insecto y luego que carga hacer click en el martillo de abajo a la izquiera que es Build.