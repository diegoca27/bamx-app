# Aplicación de Gestión de Excedentes de Comida

## Descripción

Esta aplicación tiene como objetivo conectar restaurantes con excedentes de comida directamente con usuarios registrados en el Banco de Alimentos de Guadalajara, buscando reducir el desperdicio de alimentos. La plataforma permite gestionar los excedentes de manera rápida y eficiente, asegurando que los productos lleguen a los beneficiarios antes de perder su vida útil.

## Características Principales

- **Conexión entre restaurantes y Banco de Alimentos:** Los restaurantes pueden registrar excedentes de comida que no pueden vender, y los usuarios del Banco de Alimentos podrán acceder a estos alimentos.
- **Optimización del proceso:** La aplicación ayuda a gestionar los alimentos disponibles, priorizando aquellos que están más próximos a caducar.
- **Reducción del desperdicio:** Los restaurantes pueden reducir su desperdicio de alimentos al donar aquellos productos que no pueden vender pero que aún están en buenas condiciones.
- **Gestión rápida y organizada:** Se garantiza que los productos se distribuyan de manera eficiente y lleguen a los beneficiarios en el menor tiempo posible.

## Tecnologías utilizadas

- **Frontend:** React Native con Expo.
- **Backend:** Firebase (Firestore, Auth, Cloud Functions).
- **Base de Datos:** Firebase Firestore.
- **Geolocalización:** Google Maps API.
- **Plataformas soportadas:** Android y iOS.
---

## Instalación

### 1. Requisitos previos

Asegúrate de tener las siguientes herramientas instaladas en tu sistema:

- [Node.js](https://nodejs.org/) (versión recomendada 14.x o superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (instalado globalmente)
- [Firebase CLI](https://firebase.google.com/docs/cli) (para la configuración del backend)
- [Git](https://git-scm.com/)

### 2. Clonar el repositorio

Clona este repositorio en tu máquina local usando Git:

```bash
git clone https://github.com/tu-usuario/bapal.git
cd bapal
```

### 3. Instalación de dependencias

Instala las dependencias de Node.js utilizando npm o yarn:

```bash
# Usando npm
npx expo install
```

### 4. Configuración de Firebase

1. Crea un proyecto en [Firebase](https://firebase.google.com/).
2. Habilita Firestore, Firebase Authentication y Cloud Functions.
3. Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase.
4. Configura la CLI de Firebase:

```bash
firebase login
firebase init
```

### 5. Ejecución de la aplicación

Para correr la aplicación localmente en tu dispositivo o emulador:

```bash
npx expo start
```

Esto abrirá una pestaña en tu consola, donde podrás escanear el código QR para probar la aplicación en tu dispositivo móvil utilizando la app Expo Go, o ejecutar un emulador de Android o iOS.

---

## Uso

### Crear cuentas

1. Los restaurantes y los usuarios finales pueden registrarse directamente en la aplicación.
2. Los restaurantes pueden crear ofertas de alimentos, y los usuarios pueden visualizar las ofertas disponibles cerca de su ubicación.

### Realizar pedidos

1. Los usuarios pueden visualizar las ofertas disponibles en tiempo real.
2. Selecciona una oferta y procede con el pedido.
3. Los restaurantes recibirán una notificación del pedido y generarán un código QR para la entrega.

---

## Despliegue en producción

### 1. Configuración en Firebase

Para desplegar el backend en Firebase:

```bash
firebase deploy
```

Esto desplegará las funciones de backend y actualizará Firestore en tu proyecto en la nube.

### 2. Construcción para dispositivos móviles

Expo ofrece una herramienta para construir aplicaciones nativas:

```bash
# Para Android
expo build:android

# Para iOS
expo build:ios
```

Sigue las instrucciones proporcionadas por Expo para generar los archivos `.apk` y `.ipa`.

---



## Contacto

Para cualquier consulta o sugerencia, puedes contactar a:

- Diego Calvario: [A01642806@tec.mx](mailto:A01642806@tec.mx)
- Sergio Ramirez: [A01641886@tec.mx](mailto:A01641886@tec.mx)
