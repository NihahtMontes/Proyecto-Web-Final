# 📘 README — Hotel Booking System

---

## GUÍA TÉCNICA COMPLETA

---

### ⚠️ ANTES DE EMPEZAR — REQUISITOS OBLIGATORIOS

Cada integrante debe instalar exactamente estas versiones:

| Herramienta | Versión | Comando de verificación |
|---|---|---|
| Node.js | 18.x o 20.x LTS | `node -v` |
| npm | 9.x o superior | `npm -v` |
| MongoDB | 7.x (local o Atlas) | `mongod --version` |
| Git | 2.40+ | `git --version` |
| VS Code | Última estable | — |

**Extensiones VS Code obligatorias:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- MongoDB for VS Code
- Thunder Client (para probar API)

---

### 📂 ESTRUCTURA INICIAL DEL PROYECTO

**Un SOLO integrante (Alejandro) crea el repositorio.** Los demás clonan.

```bash
# Alejandro ejecuta ESTO y solo Alejandro:
mkdir booking-hotel
cd booking-hotel
git init
npm init -y
```

**Estructura de carpetas que debe quedar creada ANTES de empezar a codificar:**

```
booking-hotel/
├── client/                          # React + Vite (Alex)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── cliente/
│   │   │   ├── empleado/
│   │   │   └── admin/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                          # Node + Express (Alejandro + Erick)
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Service.js
│   │   ├── Review.js
│   │   └── CleaningTask.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── room.routes.js
│   │   ├── booking.routes.js
│   │   ├── cleaning.routes.js
│   │   ├── user.routes.js
│   │   ├── service.routes.js
│   │   └── dashboard.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── room.controller.js
│   │   ├── booking.controller.js
│   │   ├── cleaning.controller.js
│   │   ├── user.controller.js
│   │   ├── service.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── utils/
│   │   ├── email.js
│   │   ├── bookingApi.js
│   │   └── cloudinary.js
│   ├── index.js
│   └── package.json
├── .gitignore
├── package.json                    # Raíz (scripts compartidos)
└── README.md
```

---

### 🔧 CONFIGURACIÓN INICIAL — PASO A PASO (Ejecutar una sola vez entre todos)

#### Paso 1 — Alejandro: Inicializar raíz y server

```bash
cd booking-hotel
npm init -y

# Instalar dependencias del servidor
cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken nodemailer cloudinary multer node-cron axios
npm install -D nodemon

cd ..
```

#### Paso 2 — Alex: Inicializar cliente (React + Vite + Tailwind)

```bash
cd booking-hotel/client
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios recharts react-datepicker react-icons react-hot-toast
npm install -D tailwindcss @tailwindcss/vite

# NO MODIFICAR server/ bajo ninguna circunstancia
```

#### Paso 3 — Alejandro: Configurar Tailwind (archivo client/vite.config.js)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

#### Paso 4 — Alejandro: Configurar client/src/index.css

```css
@import "tailwindcss";
```

#### Paso 5 — Alejandro: Crear archivo .gitignore en la raíz

```
node_modules/
.env
dist/
.DS_Store
```

#### Paso 6 — Alejandro: Crear archivo server/.env (usar MongoDB Atlas URL)

```
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/booking-hotel
JWT_SECRET=una_clave_secreta_larga_y_aleatoria_aqui
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAPIDAPI_KEY=
EMAIL_USER=
EMAIL_PASS=
```

#### Paso 7 — Configurar scripts en el package.json raíz

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev",
    "install-all": "cd server && npm install && cd ../client && npm install"
  }
}
```

```bash
# Alejandro instala concurrently en la raíz:
npm install concurrently -D
```

---

## 🧩 DIVISIÓN DEL TRABAJO EN 3 PERSONAS

---

### 🟦 ALEJANDRO — BACKEND FUNDACIÓN (Server Core)

**Responsabilidad:** TODO lo que es la base del servidor. Sin esto, los demás no pueden avanzar. Debe terminar PRIMERO para que Erick pueda construir encima.

#### Archivos que SÍ crea/modifica Alejandro:

| Archivo | Qué hace |
|---|---|
| `server/package.json` | Dependencias del backend |
| `server/.env` | Variables de entorno |
| `server/index.js` | Punto de entrada de Express |
| `server/config/db.js` | Conexión a MongoDB |
| `server/config/env.js` | Carga de variables de entorno |
| `server/models/User.js` | Modelo de usuario |
| `server/models/Room.js` | Modelo de habitación |
| `server/models/Booking.js` | Modelo de reserva |
| `server/models/Service.js` | Modelo de servicio |
| `server/models/Review.js` | Modelo de calificación |
| `server/models/CleaningTask.js` | Modelo de tarea de limpieza |
| `server/routes/auth.routes.js` | Rutas de autenticación |
| `server/controllers/auth.controller.js` | Lógica de registro/login |
| `server/middleware/auth.middleware.js` | Middleware JWT y roles |
| `.gitignore` | Ignorar node_modules, .env |
| `package.json` (raíz) | Scripts compartidos |
| `client/vite.config.js` | Proxy y Tailwind |
| `client/src/index.css` | Directiva Tailwind |

#### Archivos que NUNCA toca Alejandro:
- ❌ `server/routes/room.routes.js` → De Erick
- ❌ `server/routes/booking.routes.js` → De Erick
- ❌ `server/routes/cleaning.routes.js` → De Erick
- ❌ `server/routes/user.routes.js` → De Erick
- ❌ `server/routes/service.routes.js` → De Erick
- ❌ `server/routes/dashboard.routes.js` → De Erick
- ❌ `server/controllers/` (excepto auth.controller.js) → De Erick
- ❌ `server/utils/` → De Erick
- ❌ TODOS los archivos dentro de `client/src/` → De Alex
- ❌ `client/package.json` → De Alex
- ❌ `client/index.html` → De Alex

#### Instrucciones Detalladas para Alejandro:

---

**1. `server/config/db.js`**

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

**2. `server/config/env.js`**

```js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
};
```

---

**3. `server/models/User.js`**

Campos obligatorios:
- `name`: String, requerido, trim
- `email`: String, requerido, único, lowercase, trim
- `password`: String, requerido, minlength 6
- `role`: String, enum `['cliente', 'empleado', 'admin']`, default `'cliente'`
- `phone`: String
- `createdAt`: Date, default Date.now

Middleware pre-save para hashear contraseña con bcrypt (solo si se modifica).

Método de instancia `matchPassword(enteredPassword)` que compara con bcrypt.

---

**4. `server/models/Room.js`**

Campos obligatorios:
- `number`: Number, requerido, único
- `type`: String, enum `['estándar', 'suite', 'premium']`, requerido
- `pricePerNight`: Number, requerido
- `capacity`: Number, requerido, default 2
- `description`: String
- `images`: [String], default []
- `status`: String, enum `['disponible', 'ocupado', 'limpieza', 'sucio']`, default `'disponible'`
- `services`: [{ type: ObjectId, ref: 'Service' }]

---

**5. `server/models/Booking.js`**

Campos obligatorios:
- `user`: ObjectId, ref 'User', requerido
- `room`: ObjectId, ref 'Room', requerido
- `checkIn`: Date, requerido
- `checkOut`: Date, requerido
- `nights`: Number, requerido
- `basePrice`: Number, requerido
- `servicesTotal`: Number, default 0
- `totalPrice`: Number, requerido
- `services`: [{ service: ObjectId, ref 'Service', quantity: Number }]
- `status`: String, enum `['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada']`, default `'pendiente'`
- `paymentMethod`: String, enum `['tarjeta', 'efectivo', 'transferencia']`, requerido
- `createdAt`: Date, default Date.now

---

**6. `server/models/Service.js`**

Campos obligatorios:
- `name`: String, requerido, único
- `description`: String
- `price`: Number, requerido
- `icon`: String (nombre de icono de react-icons, ej: "FaWifi")

---

**7. `server/models/Review.js`**

Campos obligatorios:
- `user`: ObjectId, ref 'User', requerido
- `booking`: ObjectId, ref 'Booking', requerido
- `rating`: Number, requerido, min 1, max 5
- `comment`: String, default ''
- `createdAt`: Date, default Date.now

Índice compuesto único en [user, booking] para que un usuario solo pueda calificar una vez por reserva.

---

**8. `server/models/CleaningTask.js`**

Campos obligatorios:
- `room`: ObjectId, ref 'Room', requerido
- `employee`: ObjectId, ref 'User', requerido
- `status`: String, enum `['pendiente', 'en_progreso', 'completada']`, default `'pendiente'`
- `startedAt`: Date
- `completedAt`: Date
- `createdAt`: Date, default Date.now

---

**9. `server/middleware/auth.middleware.js`**

Dos middlewares exportados:

`protect`: Verifica token JWT del header `Authorization: Bearer <token>`. Decodifica y añade `req.user` con el usuario completo (sin password).

`authorize(...roles)`: Recibe roles permitidos. Ej: `authorize('admin', 'empleado')`. Verifica que `req.user.role` esté en la lista. Si no, devuelve 403.

---

**10. `server/controllers/auth.controller.js`**

Funciones exportadas:

`register`: POST. Recibe name, email, password. Crea usuario. Devuelve token JWT.

`login`: POST. Recibe email, password. Busca usuario, compara contraseña. Devuelve token JWT con payload { id, role }.

`getMe`: GET. Devuelve datos del usuario autenticado (req.user) sin password.

Token JWT se genera con `jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '30d' })`.

---

**11. `server/routes/auth.routes.js`**

```js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
```

---

**12. `server/index.js`**

Debe:
1. Cargar dotenv
2. Conectar a MongoDB
3. Crear app Express
4. Usar `cors()` y `express.json()`
5. Montar ruta `app.use('/api/auth', authRoutes)`
6. Ruta de prueba `app.get('/', (req, res) => res.json({ mensaje: 'API funcionando' }))`
7. Escuchar en `process.env.PORT`
8. Un placeholder comentado `// app.use('/api/rooms', roomRoutes)` que Erick descomentará
9. Un placeholder comentado `// app.use('/api/bookings', bookingRoutes)` que Erick descomentará
10. Igual para cleaning, users, services, dashboard

---

**13. `package.json` raíz — Scripts**

```json
{
  "name": "booking-hotel",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npx nodemon index.js",
    "client": "cd client && npm run dev",
    "install-all": "cd server && npm install && cd ../client && npm install"
  }
}
```

---

**14. `client/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

---

**Orden de trabajo de Alejandro:**
1. Crear estructura de carpetas y archivos vacíos
2. `config/db.js` y `config/env.js`
3. Los 6 modelos (User, Room, Booking, Service, Review, CleaningTask) en ese orden
4. `middleware/auth.middleware.js`
5. `controllers/auth.controller.js` + `routes/auth.routes.js`
6. `server/index.js` (montar solo auth, dejar placeholders para Erick)
7. `client/vite.config.js` y `client/src/index.css`
8. `package.json` raíz con scripts
9. `.gitignore`
10. Probar: `POST /api/auth/register` y `POST /api/auth/login` con Thunder Client
11. Hacer commit y push. Avisar a Erick y Alex que YA PUEDEN EMPEZAR.

---

### 🟩 ERICK — BACKEND API (Todos los endpoints funcionales)

**Responsabilidad:** TODA la lógica de negocio, todos los endpoints, integraciones externas. Empieza DESPUÉS de que Alejandro termine los modelos y el middleware de auth.

#### Archivos que SÍ crea/modifica Erick:

| Archivo | Qué hace |
|---|---|
| `server/controllers/room.controller.js` | CRUD habitaciones + disponibilidad |
| `server/controllers/booking.controller.js` | Crear reserva, cancelar, listar, cambiar estado |
| `server/controllers/cleaning.controller.js` | Asignar, iniciar y completar limpieza |
| `server/controllers/user.controller.js` | CRUD usuarios (solo admin) |
| `server/controllers/service.controller.js` | CRUD servicios adicionales |
| `server/controllers/dashboard.controller.js` | Métricas y estadísticas |
| `server/routes/room.routes.js` | Rutas de habitaciones |
| `server/routes/booking.routes.js` | Rutas de reservas |
| `server/routes/cleaning.routes.js` | Rutas de limpieza |
| `server/routes/user.routes.js` | Rutas de usuarios |
| `server/routes/service.routes.js` | Rutas de servicios |
| `server/routes/dashboard.routes.js` | Rutas de dashboard |
| `server/utils/email.js` | Nodemailer: envío de correos |
| `server/utils/bookingApi.js` | Booking.com RapidAPI |
| `server/utils/cloudinary.js` | Subida de imágenes a Cloudinary |
| `server/middleware/upload.middleware.js` | Multer para Cloudinary |
| `server/index.js` | Descomentar y montar todas las rutas |

#### Archivos que NUNCA toca Erick:
- ❌ `server/models/` (ninguno) → Son de Alejandro, solo los USA (require)
- ❌ `server/middleware/auth.middleware.js` → De Alejandro, solo lo USA
- ❌ `server/config/` → De Alejandro
- ❌ TODOS los archivos dentro de `client/` → De Alex
- ❌ `.gitignore`, `package.json` raíz → De Alejandro

#### Instrucciones Detalladas para Erick:

---

**1. `server/controllers/room.controller.js`**

Funciones:

`getRooms` (GET público): Lista todas las habitaciones. Soporta query params `?type=&minPrice=&maxPrice=&capacity=` para filtrar. Popula `services`.

`getAvailableRooms` (GET público): Busca habitaciones con status `disponible` que NO tengan reservas solapadas en las fechas `?checkIn=&checkOut=`. La lógica: buscar todas las habitaciones disponibles, luego excluir las que tengan bookings que se solapen (checkIn < query.checkOut Y checkOut > query.checkIn) con status confirmada o en_curso.

`getRoomById` (GET público): Busca por ID, popula services. Si no existe, 404.

`createRoom` (POST admin): Crea nueva habitación con los campos del body. Valida que number no exista ya.

`updateRoom` (PUT admin): Busca por ID y actualiza. Si no existe, 404.

`deleteRoom` (DELETE admin): Busca por ID y elimina. Si no existe, 404. Verificar que no tenga reservas activas.

`updateRoomStatus` (PATCH admin+empleado): Recibe `status` en el body. Cambia el estado de la habitación.

---

**2. `server/controllers/booking.controller.js`**

Funciones:

`createBooking` (POST cliente autenticado):
1. Recibe: roomId, checkIn, checkOut, services (array de {serviceId, quantity}), paymentMethod
2. Validar que checkOut > checkIn
3. Calcular nights (diferencia en días)
4. Buscar room, verificar que esté disponible
5. Verificar que no haya solapamiento de fechas con otras reservas
6. Calcular basePrice = room.pricePerNight × nights
7. Calcular servicesTotal = sum(service.price × quantity) para cada servicio
8. Calcular totalPrice = basePrice + servicesTotal
9. Crear booking con status 'pendiente'
10. Cambiar room.status a 'ocupado'
11. Enviar email de confirmación (usar util/email.js)
12. Devolver booking creado con populate de room y services

`getMyBookings` (GET cliente): Busca todas las reservas de req.user. Popula room y services. Ordena por createdAt descendente.

`cancelBooking` (PATCH cliente): Busca booking por ID, verifica que pertenezca a req.user y que su status sea 'pendiente'. Cambia status a 'cancelada'. Cambia room.status a 'disponible'.

`getAllBookings` (GET admin): Lista todas las reservas. Soporta filtros `?status=&room=&user=`. Popula user (name, email) y room (number, type).

`updateBookingStatus` (PATCH admin): Recibe status en body. Cambia el estado de la reserva. Si status es 'completada', también cambia room.status a 'sucio'.

`createReview` (POST cliente): Recibe rating y comment. Verifica que el booking pertenezca al usuario y que su status sea 'completada'. Crea review. Si ya existe review para ese booking + user, devuelve 400.

---

**3. `server/controllers/cleaning.controller.js`**

Funciones:

`getMyTasks` (GET empleado): Busca CleaningTasks donde employee = req.user._id. Popula room (number, type, status). Ordena por createdAt descendente.

`getAllTasks` (GET admin): Lista todas las tareas de limpieza. Popula room y employee (name). Soporta filtro `?status=`.

`assignTask` (POST admin): Recibe roomId y employeeId. Verifica que el employee tenga role 'empleado'. Verifica que la room esté en status 'sucio'. Crea CleaningTask. Cambia room.status a 'limpieza'.

`startTask` (PATCH empleado): Busca task por ID, verifica que employee = req.user._id y status = 'pendiente'. Cambia status a 'en_progreso', guarda startedAt = Date.now().

`completeTask` (PATCH empleado): Busca task por ID, verifica que employee = req.user._id y status = 'en_progreso'. Cambia status a 'completada', guarda completedAt = Date.now(). Cambia room.status a 'disponible'.

---

**4. `server/controllers/user.controller.js`**

Funciones (todas requieren admin):

`getUsers` (GET admin): Lista todos los usuarios. Soporta filtro `?role=`. No devuelve password.

`createUser` (POST admin): Crea usuario con rol específico (para crear empleados y admins). Hashear password.

`deleteUser` (DELETE admin): Elimina usuario por ID. No permite eliminarse a sí mismo.

---

**5. `server/controllers/service.controller.js`**

Funciones:

`getServices` (GET público): Lista todos los servicios.

`createService` (POST admin): Crea servicio con name, description, price, icon.

`updateService` (PUT admin): Actualiza servicio por ID.

`deleteService` (DELETE admin): Elimina servicio por ID.

---

**6. `server/controllers/dashboard.controller.js`**

Funciones (todas requieren admin):

`getSummary` (GET admin): Devuelve un objeto con:
- `totalRooms`: count de todas las habitaciones
- `occupiedRooms`: count de habitaciones con status 'ocupado'
- `occupancyRate`: (occupiedRooms / totalRooms) × 100
- `activeBookings`: count de bookings con status 'confirmada' o 'en_curso'
- `monthlyRevenue`: suma de totalPrice de bookings del mes actual con status confirmada, en_curso o completada
- `averageRating`: promedio de rating de todas las reviews
- `totalReviews`: count de reviews

`getOccupancyData` (GET admin): Devuelve array con ocupación por tipo de habitación. Agregación de MongoDB.
- `_id`: tipo de habitación
- `total`: count total por tipo
- `occupied`: count con status 'ocupado'
- `percentage`: (occupied / total) × 100

`getRevenueData` (GET admin): Devuelve ingresos por mes (últimos 6 meses). Agregación de MongoDB agrupando por mes con $month en createdAt.

`getTopRooms` (GET admin): Devuelve top 5 habitaciones más reservadas. Agregación: agrupar bookings por room, contar, ordenar descendente, limit 5. Populate room (number, type).

---

**7. Archivos de rutas (7 archivos)**

Cada archivo de ruta debe seguir este patrón:

```js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { funcion1, funcion2 } = require('../controllers/room.controller');

router.get('/', funcion1);
router.get('/available', funcion2);
router.get('/:id', funcion3);
router.post('/', protect, authorize('admin'), funcion4);
router.put('/:id', protect, authorize('admin'), funcion5);
router.delete('/:id', protect, authorize('admin'), funcion6);
router.patch('/:id/status', protect, authorize('admin', 'empleado'), funcion7);

module.exports = router;
```

**Tabla completa de endpoints con middlewares:**

##### auth.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| POST | `/register` | ninguno | register |
| POST | `/login` | ninguno | login |
| GET | `/me` | protect | getMe |

##### room.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| GET | `/` | ninguno | getRooms |
| GET | `/available` | ninguno | getAvailableRooms |
| GET | `/:id` | ninguno | getRoomById |
| POST | `/` | protect, authorize('admin') | createRoom |
| PUT | `/:id` | protect, authorize('admin') | updateRoom |
| DELETE | `/:id` | protect, authorize('admin') | deleteRoom |
| PATCH | `/:id/status` | protect, authorize('admin','empleado') | updateRoomStatus |

##### booking.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| POST | `/` | protect, authorize('cliente') | createBooking |
| GET | `/me` | protect, authorize('cliente') | getMyBookings |
| PATCH | `/:id/cancel` | protect, authorize('cliente') | cancelBooking |
| GET | `/all` | protect, authorize('admin') | getAllBookings |
| PATCH | `/:id/status` | protect, authorize('admin') | updateBookingStatus |
| POST | `/:id/review` | protect, authorize('cliente') | createReview |

##### cleaning.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| GET | `/me` | protect, authorize('empleado') | getMyTasks |
| GET | `/all` | protect, authorize('admin') | getAllTasks |
| POST | `/assign` | protect, authorize('admin') | assignTask |
| PATCH | `/:id/start` | protect, authorize('empleado') | startTask |
| PATCH | `/:id/complete` | protect, authorize('empleado') | completeTask |

##### user.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| GET | `/` | protect, authorize('admin') | getUsers |
| POST | `/` | protect, authorize('admin') | createUser |
| DELETE | `/:id` | protect, authorize('admin') | deleteUser |

##### service.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| GET | `/` | ninguno | getServices |
| POST | `/` | protect, authorize('admin') | createService |
| PUT | `/:id` | protect, authorize('admin') | updateService |
| DELETE | `/:id` | protect, authorize('admin') | deleteService |

##### dashboard.routes.js
| Método | Ruta | Middleware | Controlador |
|---|---|---|---|
| GET | `/summary` | protect, authorize('admin') | getSummary |
| GET | `/occupancy` | protect, authorize('admin') | getOccupancyData |
| GET | `/revenue` | protect, authorize('admin') | getRevenueData |
| GET | `/top-rooms` | protect, authorize('admin') | getTopRooms |

---

**8. `server/utils/email.js`**

Usar Nodemailer con transporter (Gmail o servicio que prefieran). Exportar funciones:

`sendBookingConfirmation(userEmail, bookingDetails)` — Enviar al confirmar reserva
`sendCheckInReminder(userEmail, bookingDetails)` — Enviar 1 día antes del check-in
`sendCheckOutReminder(userEmail, bookingDetails)` — Enviar 1 día antes del check-out
`sendReviewInvitation(userEmail, bookingDetails)` — Enviar al completar estadía

---

**9. `server/utils/bookingApi.js`**

Usar axios para pegarle a RapidAPI (Booking.com). Exportar función:

`searchHotelImages(hotelName)` — Busca imágenes del hotel. Devuelve array de URLs. Cachear resultados en un Map para no repetir llamadas.

---

**10. `server/utils/cloudinary.js`**

Configurar cloudinary con las credenciales del .env. Exportar función:

`uploadImage(filePath)` — Sube imagen a Cloudinary, devuelve la URL segura.

---

**11. `server/middleware/upload.middleware.js`**

Configurar multer con `multer({ storage: multer.memoryStorage() })`. Exportar `upload` configurado para single file upload.

---

**12. `server/index.js` — Lo que Erick debe modificar**

Descomentar y añadir estas líneas DESPUÉS de que Alejandro las deje como placeholders:

```js
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cleaning', cleaningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
```

Añadir los `require` correspondientes al inicio del archivo.

---

**13. Tareas programadas (node-cron) en `server/index.js`**

Añadir al final de `index.js`:

```js
const cron = require('node-cron');

// Cada día a las 00:01 - Auto check-in: cambia bookings 'confirmada' a 'en_curso'
cron.schedule('1 0 * * *', async () => {
  // Buscar bookings confirmadas donde checkIn <= hoy Y checkOut > hoy
  // Cambiar status a 'en_curso'
});

// Cada día a las 00:02 - Auto check-out: cambia bookings 'en_curso' a 'completada'
cron.schedule('2 0 * * *', async () => {
  // Buscar bookings en_curso donde checkOut <= hoy
  // Cambiar status a 'completada'
  // Cambiar room.status a 'sucio'
  // Enviar email de invitación a calificar
});
```

---

**Orden de trabajo de Erick:**
1. Esperar a que Alejandro termine y pushee
2. Hacer pull del repo
3. `utils/email.js`
4. `utils/bookingApi.js`
5. `utils/cloudinary.js`
6. `middleware/upload.middleware.js`
7. `controllers/room.controller.js` → `routes/room.routes.js`
8. `controllers/service.controller.js` → `routes/service.routes.js`
9. `controllers/booking.controller.js` → `routes/booking.routes.js`
10. `controllers/cleaning.controller.js` → `routes/cleaning.routes.js`
11. `controllers/user.controller.js` → `routes/user.routes.js`
12. `controllers/dashboard.controller.js` → `routes/dashboard.routes.js`
13. Modificar `server/index.js` para montar todas las rutas + tareas cron
14. Probar CADA endpoint con Thunder Client antes de hacer commit
15. Commit y push. Avisar a Alex.

---

### 🟨 ALEX — FRONTEND (React + Vite + Tailwind)

**Responsabilidad:** TODO el frontend. Cada componente, cada página, cada llamada a la API. Puede empezar EN PARALELO con Erick, usando datos mock mientras Erick termina los endpoints.

#### Archivos que SÍ crea/modifica Alex:

TODOS los archivos dentro de `client/src/`, `client/index.html`, `client/package.json`.

#### Archivos que NUNCA toca Alex:
- ❌ TODOS los archivos dentro de `server/` (cero, nada, absolutamente ninguno)
- ❌ `client/vite.config.js` → Ya lo configuró Alejandro
- ❌ `client/src/index.css` → Ya lo configuró Alejandro

#### Instrucciones Detalladas para Alex:

---

**1. Configuración inicial**

```bash
cd client
npm install react-router-dom axios recharts react-datepicker react-icons react-hot-toast
```

---

**2. `client/src/services/api.js`**

Crear instancia de axios con baseURL vacía (usa el proxy de Vite). Interceptor para añadir token JWT del localStorage al header Authorization.

```js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Exportar funciones de servicio:

```js
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getAvailable: (params) => api.get('/rooms/available', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, { status }),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/me'),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getAll: (params) => api.get('/bookings/all', { params }),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  createReview: (id, data) => api.post(`/bookings/${id}/review`, data),
};

export const cleaningAPI = {
  getMyTasks: () => api.get('/cleaning/me'),
  getAll: (params) => api.get('/cleaning/all', { params }),
  assign: (data) => api.post('/cleaning/assign', data),
  start: (id) => api.patch(`/cleaning/${id}/start`),
  complete: (id) => api.patch(`/cleaning/${id}/complete`),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getOccupancy: () => api.get('/dashboard/occupancy'),
  getRevenue: () => api.get('/dashboard/revenue'),
  getTopRooms: () => api.get('/dashboard/top-rooms'),
};
```

---

**3. `client/src/context/AuthContext.jsx`**

Proveedor de contexto que maneje:
- `user`: usuario actual (null si no autenticado)
- `token`: JWT en localStorage
- `loading`: true mientras se verifica sesión
- `login(email, password)`: llama a authAPI.login, guarda token, guarda user
- `register(name, email, password)`: llama a authAPI.register, guarda token, guarda user
- `logout()`: limpia localStorage, setea user a null

Al montar el provider, verificar si hay token en localStorage y llamar a getMe() para restaurar sesión.

---

**4. `client/src/components/layout/Navbar.jsx`**

Barra de navegación responsiva con Tailwind:
- Logo "Hotel Booking" a la izquierda
- Links que cambian según el rol:
  - No autenticado: Home, Habitaciones, Login, Register
  - Cliente: Home, Habitaciones, Mis Reservas, Perfil, Logout
  - Empleado: Panel Limpieza, Logout
  - Admin: Dashboard, Habitaciones, Usuarios, Servicios, Logout
- Menú hamburguesa en móvil
- Indicador visual del rol activo

---

**5. `client/src/components/layout/Footer.jsx`**

Footer simple con © 2025 Hotel Booking, links a políticas ficticias.

---

**6. `client/src/components/layout/Layout.jsx`**

Componente wrapper: Navbar + children + Footer. Usar en App.jsx para envolver todas las rutas.

---

**7. `client/src/components/ui/RoomCard.jsx`**

Tarjeta de habitación para mostrar en grid:
- Imagen principal
- Número de habitación
- Tipo (badge de color diferente para estándar/suite/premium)
- Precio por noche
- Capacidad (icono de persona)
- Estado (badge de colores: verde=disponible, rojo=ocupado, etc.)
- Botón "Ver detalle"

Props: `room`, `onClick`

---

**8. `client/src/components/ui/BookingCard.jsx`**

Tarjeta para mostrar una reserva en el historial:
- Número de habitación
- Fechas (check-in → check-out)
- Estado (badge con color: amarillo=pendiente, verde=confirmada, azul=en_curso, gris=completada, rojo=cancelada)
- Precio total
- Si status  completada y no tiene review: botón "Calificar"

---

**9. `client/src/components/ui/LoadingSpinner.jsx`**

Spinner de carga centrado. Usar tailwind animate-spin.

---

**10. `client/src/components/ui/EmptyState.jsx`**

Mensaje de "No hay datos" con icono. Props: `message`, `icon`.

---

**11. `client/src/components/ui/ProtectedRoute.jsx`**

Componente que verifica autenticación y rol. Recibe `allowedRoles` array. Si user no está autenticado, redirige a /login. Si no tiene el rol, muestra mensaje "No autorizado".

Props: `children`, `allowedRoles`

---

**12. `client/src/pages/public/HomePage.jsx`**

Secciones:
1. **Hero** — Imagen de hotel de fondo (usar API de Booking de Erick), título "Encuentra tu estancia perfecta", subtítulo, botón "Ver habitaciones"
2. **Servicios destacados** — Grid de 3-4 servicios con iconos
3. **Habitaciones populares** — Grid de RoomCards (top 4)
4. **Call to action** — "¿Listo para tu próxima escapada?"

---

**13. `client/src/pages/public/RoomsPage.jsx`**

- Filtros en sidebar/top: tipo (select), precio (range), capacidad (select)
- Grid de RoomCards con los resultados
- Al hacer clic, navega a /habitaciones/:id
- Loading spinner mientras carga
- Empty state si no hay resultados

---

**14. `client/src/pages/public/RoomDetailPage.jsx`**

- Galería de imágenes (carrusel simple o grid de imágenes)
- Información: número, tipo (badge), precio/noche, capacidad, descripción
- Servicios del cuarto (lista con iconos)
- Calendario para seleccionar fechas (usar react-datepicker con range)
- Al seleccionar fechas, mostrar: noches × precio = subtotal
- Botón "Reservar ahora" (redirige a /reservar si está autenticado, si no a /login)

---

**15. `client/src/pages/public/LoginPage.jsx`**

Formulario con email y password. Validación básica. Botón submit. Link a /register. Toast de éxito/error.

---

**16. `client/src/pages/public/RegisterPage.jsx`**

Formulario con name, email, password, confirmPassword. Validación. Link a /login.

---

**17. `client/src/pages/cliente/BookingConfirmPage.jsx`**

Esta es la página MÁS importante del flujo de reserva. Muestra:

1. **Resumen de la habitación** — Imagen, número, tipo
2. **Fechas seleccionadas** — Check-in, check-out, noches totales
3. **Precio base** — habitación × noches
4. **Servicios adicionales** — Checkboxes con nombre, descripción, precio. Al marcar, se suma al total.
5. **Total a pagar** — Grande y destacado
6. **Selección de método de pago** — Radio buttons: Tarjeta, Efectivo, Transferencia
7. **Simulación de pago**: Si elige tarjeta, mostrar campos de tarjeta (número, fecha, CVV — todo ficticio, no se guarda). Si es efectivo, mostrar mensaje "Pagar en recepción". Si transferencia, mostrar datos bancarios ficticios.
8. **Botón "Confirmar Reserva"** — Llama a bookingAPI.create(). Toast de éxito. Redirige a /mis-reservas.

Recibe roomId, checkIn, checkOut por query params o location state.

---

**18. `client/src/pages/cliente/MyBookingsPage.jsx`**

- Título "Mis Reservas"
- Lista de BookingCards
- Cada card tiene botón "Cancelar" si status pendiente
- Cada card tiene botón "Calificar" si status completada y sin review
- Modal para escribir review (estrellas 1-5 + comentario)

---

**19. `client/src/pages/cliente/ProfilePage.jsx`**

Muestra datos del usuario. Botón para editar (solo nombre y teléfono). Cambiar contraseña (modal aparte).

---

**20. `client/src/pages/empleado/CleaningPanelPage.jsx`**

- Título "Panel de Limpieza"
- Lista de tareas asignadas al empleado
- Cada tarea muestra: número de habitación, tipo, estado de la tarea
- Si pendiente: botón verde "Iniciar limpieza"
- Si en_progreso: botón azul "Completar limpieza"
- Si completada: texto "Completada" en gris con check
- Al completar: toast "Habitación X lista"

---

**21. `client/src/pages/admin/DashboardPage.jsx`**

Layout de dashboard con:

**Cards superiores (4):**
- Ocupación: % y barra de progreso
- Ingresos del mes: $$$
- Reservas activas: número
- Calificación promedio: estrellas

**Gráficos (usar Recharts):**
- Fila 1: Gráfico de dona — Ocupación por tipo de habitación
- Fila 2: Gráfico de barras — Ingresos mensuales (últimos 6 meses)
- Fila 3: Gráfico de barras horizontal — Top 5 habitaciones más reservadas

---

**22. `client/src/pages/admin/AdminRoomsPage.jsx`**

- Tabla de todas las habitaciones
- Columnas: Número, Tipo, Precio, Capacidad, Estado (badge), Acciones
- Botón "Añadir habitación" abre modal/formulario
- Cada fila tiene botones: Editar (modal), Eliminar (confirmación)
- Modal de crear/editar: formulario con número, tipo (select), precio, capacidad, descripción, servicios (checkboxes)

---

**23. `client/src/pages/admin/AdminUsersPage.jsx`**

Tabla de usuarios. Columnas: Nombre, Email, Rol (badge), Teléfono, Acciones. Botón crear usuario (especialmente para empleados). Selector de rol. Eliminar usuario.

---

**24. `client/src/pages/admin/AdminServicesPage.jsx`**

Tabla de servicios. Columnas: Icono, Nombre, Descripción, Precio, Acciones. Crear/editar/eliminar modales.

---

**25. `client/src/pages/admin/AdminBookingsPage.jsx`**

Tabla de TODAS las reservas. Columnas: Cliente, Habitación, Check-in, Check-out, Total, Estado. Filtros por estado. Botón para cambiar estado (select en la misma tabla).

---

**26. `client/src/pages/admin/AdminCleaningPage.jsx`**

- Tabla de todas las tareas de limpieza
- Columnas: Habitación, Empleado, Estado, Inicio, Fin, Duración
- Botón "Asignar tarea" abre modal: seleccionar habitación (solo las sucias), seleccionar empleado, botón asignar
- Mostrar tiempo promedio de limpieza en una card superior

---

**27. `client/src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Importar TODAS las páginas
import HomePage from './pages/public/HomePage';
import RoomsPage from './pages/public/RoomsPage';
import RoomDetailPage from './pages/public/RoomDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import BookingConfirmPage from './pages/cliente/BookingConfirmPage';
import MyBookingsPage from './pages/cliente/MyBookingsPage';
import ProfilePage from './pages/cliente/ProfilePage';
import CleaningPanelPage from './pages/empleado/CleaningPanelPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminCleaningPage from './pages/admin/AdminCleaningPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/habitaciones" element={<RoomsPage />} />
            <Route path="/habitaciones/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Cliente */}
            <Route path="/reservar" element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <BookingConfirmPage />
              </ProtectedRoute>
            } />
            <Route path="/mis-reservas" element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <MyBookingsPage />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Empleado */}
            <Route path="/panel-limpieza" element={
              <ProtectedRoute allowedRoles={['empleado']}>
                <CleaningPanelPage />
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/habitaciones" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRoomsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/servicios" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminServicesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/reservas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookingsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/limpieza" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCleaningPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

**28. `client/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

**29. `client/index.html`**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hotel Booking</title>
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body class="bg-gray-50 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

**Orden de trabajo de Alex:**
1. Ejecutar `npm create vite@latest . -- --template react` en client/
2. Instalar dependencias (react-router-dom, axios, recharts, react-datepicker, react-icons, react-hot-toast)
3. Crear estructura de carpetas
4. `services/api.js`
5. `context/AuthContext.jsx`
6. `components/ui/LoadingSpinner.jsx`, `EmptyState.jsx`, `ProtectedRoute.jsx`
7. `components/layout/Navbar.jsx`, `Footer.jsx`, `Layout.jsx`
8. `App.jsx` con todas las rutas (usar placeholders para páginas)
9. `main.jsx` e `index.html`
10. Páginas públicas: HomePage, RoomsPage, RoomDetailPage, LoginPage, RegisterPage
11. `components/ui/RoomCard.jsx`, `BookingCard.jsx`
12. Páginas cliente: BookingConfirmPage, MyBookingsPage, ProfilePage
13. Página empleado: CleaningPanelPage
14. Páginas admin: DashboardPage, AdminRoomsPage, AdminUsersPage, AdminServicesPage, AdminBookingsPage, AdminCleaningPage
15. Probar navegación completa con datos mock primero
16. Conectar con API real cuando Erick termine
17. Commit y push

---

### 📋 CHECKLIST FINAL DE INTEGRACIÓN

Cuando los 3 hayan terminado, hacer juntos:

- [ ] `npm run install-all` en la raíz
- [ ] Verificar que `npm run dev` levanta server en 5000 y client en 5173
- [ ] Probar flujo completo: registro → login → ver habitaciones → reservar → pagar
- [ ] Probar panel empleado: login empleado → ver tareas → iniciar → completar
- [ ] Probar panel admin: login admin → ver dashboard → crear habitación → asignar limpieza
- [ ] Verificar que los gráficos cargan datos reales
- [ ] Verificar emails (revisar spam)
- [ ] Corregir bugs juntos
- [ ] Último commit y push

---

### 🚫 REGLAS DE ORO (NO ROMPER)

1. **NADIE toca archivos de otra persona.** Si necesitas un cambio en un archivo ajeno, lo pides por WhatsApp.
2. **Commits frecuentes.** Cada funcionalidad completada = un commit.
3. **Pull antes de push.** Siempre. `git pull origin main` antes de `git push`.
4. **El .env NUNCA se sube a git.** Está en .gitignore. Se comparte por privado.
5. **Probar antes de pushear.** Cada quien prueba sus endpoints/páginas antes de hacer push.
6. **Usar la misma versión de Node.** `node -v` debe coincidir. Usar nvm si es necesario.
7. **Si algo falla, preguntar.** No adivinar. No hacer cambios masivos sin consultar.
