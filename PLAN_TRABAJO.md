# 📘 PLAN DE TRABAJO FINAL — ByteHotel

> **Grupo:** ByteHotel  
> **Integrantes:** Erick, Alejandro  
> **Fase:** Corrección de bugs + Implementación completa del frontend  
> **Documento base:** README.md (guía técnica del proyecto)  

---

## 📑 ÍNDICE

| # | Sección | Descripción |
|---|---|---|
| 1 | [Antes de Empezar](#antes-de-empezar) | Reglas y prerrequisitos |
| 2 | [Resumen de Bugs Encontrados](#resumen-de-bugs-encontrados) | Evaluación completa del backend |
| 3 | [ERICK — Fase 1: Corrección de Backend](#-erick--fase-1-corrección-de-backend) | 9 bugs críticos + bugs medios + menores |
| 4 | [ERICK — Fase 2: Frontend (Parte 1)](#-erick--fase-2-frontend-parte-1) | Infraestructura + componentes + páginas públicas |
| 5 | [ALEJANDRO — Fase 2: Frontend (Parte 2)](#-alejandro--fase-2-frontend-parte-2) | Páginas cliente + empleado + admin |
| 6 | [ALLY — Fase 2: Frontend (Parte 3)](#-alex--fase-2-frontend-parte-3) | Páginas admin + App.jsx |
| 7 | [Flujo de Trabajo](#flujo-de-trabajo) | Qué hacer en qué orden |

---

## ANTES DE EMPEZAR

### Reglas

1. **Nadie toca archivos que no le corresponden sin avisar al grupo.**
2. **Siempre `git pull origin main` antes de `git push`.**
3. **Commits pequeños:** 1 fix = 1 commit, 1 componente = 1 commit.
4. **Probar antes de pushear:** cada endpoint y cada página.
5. **El `.env` NUNCA se sube a git.**

### Prerrequisitos

Verificar que ambos tengan:
- Node.js 18.x o 20.x LTS
- npm 9.x+
- MongoDB corriendo (local o Atlas)
- `git pull origin main` ejecutado

---

## RESUMEN DE BUGS ENCONTRADOS

### BUGS CRÍTICOS (bloquean la aplicación)

| # | Archivo | Bug | Solución |
|---|---|---|---|
| C1 | `server/controllers/auth.controller.js:23` | `register` acepta `role` del body. Cualquier usuario puede autoregistrarse como admin | Eliminar `role` del destructuring, forzar `role: 'cliente'` |
| C2 | `server/controllers/booking.controller.js` | `createBooking` no valida solapamiento de fechas. Dos reservas pueden overlapping | Agregar validación de solapamiento antes de crear la reserva |
| C3 | `server/controllers/dashboard.controller.js` | Solo existe `getDashboardStats`. Faltan `getSummary`, `getOccupancyData`, `getRevenueData`, `getTopRooms` | Implementar las 4 funciones con aggregation pipelines |
| C4 | `server/routes/dashboard.routes.js` | Solo 1 ruta `/stats` en vez de 4 (`/summary`, `/occupancy`, `/revenue`, `/top-rooms`) | Agregar las 4 rutas con sus controladores |
| C5 | `server/controllers/dashboard.controller.js:12` | Usa `status: 'ocupada'` pero el modelo Room tiene `'ocupado'`. Siempre retorna 0 | Cambiar `'ocupada'` por `'ocupado'` |
| C6 | `server/controllers/cleaning.controller.js` | `assignTask` no verifica que `employeeId` tenga rol `'empleado'` | Agregar verificación de rol antes de asignar |
| C7 | `server/controllers/cleaning.controller.js` | `startTask` no verifica que status sea `'pendiente'` | Agregar verificación de status |
| C8 | `server/controllers/cleaning.controller.js` | `completeTask` no verifica que status sea `'en_progreso'` | Agregar verificación de status |
| C9 | `server/package.json` | **NO EXISTE**. Dependencias están en la raíz. El server no puede arrancar | Crear `server/package.json` con todas las dependencias |

### BUGS MEDIOS (funcionalidad incompleta)

| # | Archivo | Bug | Solución |
|---|---|---|---|
| M1 | `server/utils/email.js` | 3 de 4 funciones son stubs vacíos: `sendCheckInReminder`, `sendCheckOutReminder`, `sendReviewInvitation` | Implementar las 3 funciones siguiendo el patrón de `sendBookingConfirmation` |
| M2 | `server/index.js` (cron) | Cron de check-out no envía email de invitación a calificar | Agregar `sendReviewInvitation` en el cron de check-out |
| M3 | `server/.env` | 6 variables vacías: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAPIDAPI_KEY`, `EMAIL_USER`, `EMAIL_PASS` | Llenar con valores reales (compartir por privado) |
| M4 | `client/index.html` | `lang="en"` en vez de `"es"`, título `"client"` en vez de `"Hotel Booking"`, sin clases en `<body>` | Corregir los 3 valores |
| M5 | `client/src/index.css` | 110+ líneas de CSS default de Vite que interfieren con Tailwind | Eliminar todo excepto `@import "tailwindcss";` |
| M6 | `client/src/App.css` | Archivo no especificado en el README, interfiere con Tailwind | Eliminar archivo |

### BUGS MENORES (no bloquean pero difieren del spec)

| # | Archivo | Bug |
|---|---|---|
| m1 | `server/models/Room.js` | Tiene `timestamps: true` (agrega `updatedAt`), inconsistente con otros modelos |
| m2 | `server/models/Service.js` | Tiene `timestamps: true`, inconsistente con otros modelos |
| m3 | Varios modelos | Defaults en campos opcionales (`default: ''`) no están en el spec |
| m4 | `server/utils/cloudinary.js` | Función usa `fileBuffer` en vez de `filePath` (funciona pero difiere) |
| m5 | `server/controllers/payment.controller.js` | `generateQR` no retorna `qrText` al cliente, solo `qrDataURL` |
| m6 | `server/controllers/auth.controller.js` | Console.log en `login` expone emails |

---

<a id="-erick--fase-1-corrección-de-backend"></a>
## 🟩 ERICK — FASE 1: Corrección de Backend

> **Objetivo:** Dejar el backend 100% funcional antes de que nadie toque el frontend.  
> **Duración estimada:** 2-3 días  
> **Prerrequisito:** Haber hecho `git pull origin main`  

### Orden de trabajo

Cada ítem es un commit separado. Hacer en este orden:

---

#### C1 — Corregir registro de usuario (auth.controller.js)

**Archivo:** `server/controllers/auth.controller.js`

**Problema:** La línea 23 hace `const { name, email, password, role } = req.body;` y la línea 39 hace `role: role || 'cliente'`. Esto permite que cualquier usuario se registre como admin.

**Fix:**

```js
// LÍNEA 23 — Cambiar esto:
const { name, email, password, role } = req.body;

// Por esto:
const { name, email, password } = req.body;

// LÍNEA 39 — Cambiar esto:
role: role || 'cliente',

// Por esto:
role: 'cliente',
```

**Commit:** `fix: remover role del registro público de usuarios`

---

#### C2 — Agregar validación de solapamiento de fechas (booking.controller.js)

**Archivo:** `server/controllers/booking.controller.js`

**Problema:** `createBooking` no verifica si ya existe una reserva que se solape con las fechas seleccionadas.

**Fix:** Agregar entre el paso 4 (buscar room) y el paso 5 (calcular basePrice) la siguiente validación:

```js
// Verificar solapamiento de fechas
const overlappingBooking = await Booking.findOne({
    room: roomId,
    status: { $in: ['confirmada', 'en_curso'] },
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate }
});

if (overlappingBooking) {
    return res.status(400).json({ message: 'La habitación ya tiene una reserva que se solapa con las fechas seleccionadas' });
}
```

**Nota:** Importar `Booking` al inicio del archivo si no está importado.

**Commit:** `fix: agregar validación de solapamiento de fechas en createBooking`

---

#### C3 + C4 + C5 — Reescribir dashboard controller y routes

**Archivo:** `server/controllers/dashboard.controller.js`

**Problema:** Solo existe `getDashboardStats`. Faltan `getSummary`, `getOccupancyData`, `getRevenueData`, `getTopRooms`. El status `'ocupada'` debe ser `'ocupado'`.

**Fix:** Reemplazar TODO el contenido de `dashboard.controller.js` con:

```js
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Service = require('../models/Service');

const getSummary = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Room.countDocuments({ status: 'ocupado' });
        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
        const activeBookings = await Booking.countDocuments({ status: { $in: ['confirmada', 'en_curso'] } });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRevenue = await Booking.aggregate([
            { $match: { status: { $in: ['confirmada', 'en_curso', 'completada'] }, createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const ratingResult = await Review.aggregate([
            { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
        ]);

        res.json({
            totalRooms,
            occupiedRooms,
            occupancyRate: Math.round(occupancyRate * 100) / 100,
            activeBookings,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            averageRating: ratingResult[0]?.averageRating?.toFixed(1) || 0,
            totalReviews: ratingResult[0]?.totalReviews || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const getOccupancyData = async (req, res) => {
    try {
        const occupancy = await Room.aggregate([
            { $group: { _id: '$type', total: { $sum: 1 }, occupied: { $sum: { $cond: [{ $eq: ['$status', 'ocupado'] }, 1, 0] } } } },
            { $project: { _id: 1, total: 1, occupied: 1, percentage: { $multiply: [{ $divide: ['$occupied', '$total'] }, 100] } } }
        ]);
        res.json(occupancy);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const getRevenueData = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenue = await Booking.aggregate([
            { $match: { status: { $in: ['confirmada', 'en_curso', 'completada'] }, createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalPrice' } } },
            { $sort: { '_id': 1 } }
        ]);
        res.json(revenue);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const getTopRooms = async (req, res) => {
    try {
        const topRooms = await Booking.aggregate([
            { $group: { _id: '$room', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'rooms', localField: '_id', foreignField: '_id', as: 'room' } },
            { $unwind: '$room' },
            { $project: { count: 1, 'room.number': 1, 'room.type': 1 } }
        ]);
        res.json(topRooms);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

module.exports = { getSummary, getOccupancyData, getRevenueData, getTopRooms };
```

**Archivo:** `server/routes/dashboard.routes.js`

**Fix:** Reemplazar TODO el contenido con:

```js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getSummary, getOccupancyData, getRevenueData, getTopRooms } = require('../controllers/dashboard.controller');

router.get('/summary', protect, authorize('admin'), getSummary);
router.get('/occupancy', protect, authorize('admin'), getOccupancyData);
router.get('/revenue', protect, authorize('admin'), getRevenueData);
router.get('/top-rooms', protect, authorize('admin'), getTopRooms);

module.exports = router;
```

**Commit:** `fix: reescribir dashboard con 4 endpoints y corregir status 'ocupado'`

---

#### C6 + C7 + C8 — Corregir cleaning controller

**Archivo:** `server/controllers/cleaning.controller.js`

**Fix en `assignTask`:** Agregar verificación de rol del empleado:

```js
// Después de obtener employeeId y roomId:
const employee = await User.findById(employeeId);
if (!employee || employee.role !== 'empleado') {
    return res.status(400).json({ message: 'El usuario asignado no es un empleado válido' });
}
```

**Fix en `startTask`:** Agregar verificación de status:

```js
// Antes de cambiar el status:
if (task.status !== 'pendiente') {
    return res.status(400).json({ message: 'La tarea debe estar en estado pendiente para iniciarla' });
}
```

**Fix en `completeTask`:** Agregar verificación de status:

```js
// Antes de cambiar el status:
if (task.status !== 'en_progreso') {
    return res.status(400).json({ message: 'La tarea debe estar en progreso para completarla' });
}
```

**Commit:** `fix: agregar validaciones de rol y status en cleaning controller`

---

#### C9 — Crear server/package.json

**Archivo nuevo:** `server/package.json`

**Contenido:**

```json
{
  "name": "booking-hotel-server",
  "version": "1.0.0",
  "description": "Backend del sistema hotelero ByteHotel",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "cloudinary": "^1.41.0",
    "multer": "^1.4.5-lts.1",
    "node-cron": "^3.0.3",
    "axios": "^1.6.2",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

**Pasos adicionales:**

```bash
cd server
npm install
```

**Eliminar dependencias del package.json raíz:** Quitar `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `nodemailer`, `cloudinary`, `multer`, `node-cron`, `axios`, `qrcode` del `package.json` de la raíz. Dejar solo `concurrently` como devDependency.

**Commit:** `fix: crear server/package.json y mover dependencias backend`

---

#### M1 — Implementar emails faltantes (email.js)

**Archivo:** `server/utils/email.js`

**Fix:** Implementar las 3 funciones que son stubs vacíos, siguiendo el mismo patrón de `sendBookingConfirmation`:

```js
const sendCheckInReminder = async (userEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Recordatorio de Check-in - ByteHotel',
        html: `<h2>Recordatorio de Check-in</h2>
               <p>Su estadía comienza mañana.</p>
               <p><strong>Habitación:</strong> ${bookingDetails.roomNumber}</p>
               <p><strong>Check-in:</strong> ${new Date(bookingDetails.checkIn).toLocaleDateString('es-BO')}</p>
               <p>¡Los esperamos!</p>`
    };
    await transporter.sendMail(mailOptions);
};

const sendCheckOutReminder = async (userEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Recordatorio de Check-out - ByteHotel',
        html: `<h2>Recordatorio de Check-out</h2>
               <p>Su estadía termina mañana.</p>
               <p><strong>Habitación:</strong> ${bookingDetails.roomNumber}</p>
               <p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOut).toLocaleDateString('es-BO')}</p>
               <p>Esperamos que haya disfrutado su estancia.</p>`
    };
    await transporter.sendMail(mailOptions);
};

const sendReviewInvitation = async (userEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: '¡Califique su estadía! - ByteHotel',
        html: `<h2>¿Cómo fue su estadía?</h2>
               <p>Nos gustaría conocer su opinión sobre su reciente visita.</p>
               <p><strong>Habitación:</strong> ${bookingDetails.roomNumber}</p>
               <p><strong>Estadía:</strong> ${new Date(bookingDetails.checkIn).toLocaleDateString('es-BO')} - ${new Date(bookingDetails.checkOut).toLocaleDateString('es-BO')}</p>
               <p>¡Gracias por elegirnos!</p>`
    };
    await transporter.sendMail(mailOptions);
};
```

**Commit:** `feat: implementar sendCheckInReminder, sendCheckOutReminder y sendReviewInvitation`

---

#### M2 — Agregar email de invitación a calificar en cron de check-out

**Archivo:** `server/index.js`

En el cron de check-out (00:02), agregar después de cambiar status de booking y room:

```js
// Enviar email de invitación a calificar
const { sendReviewInvitation } = require('./utils/email');
for (const booking of completedBookings) {
    await booking.populate('room', 'number type');
    sendReviewInvitation(booking.user?.email || '', {
        roomNumber: booking.room.number,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
    }).catch(err => console.error('Error enviando email de review:', err));
}
```

**Nota:** Ajustar según la estructura actual del cron. Ya está importado `sendReviewInvitation` en el archivo o importarlo.

**Commit:** `feat: agregar envío de email de invitación a calificar en cron de check-out`

---

#### M6 — Eliminar console.log en login (auth.controller.js)

**Archivo:** `server/controllers/auth.controller.js`

Eliminar o comentar todos los `console.log()` que exponen datos del usuario (email, token).

**Commit:** `fix: eliminar console.log que exponen datos sensibles en login`

---

#### M5 — payment.controller.js: retornar qrText además de qrDataURL

**Archivo:** `server/controllers/payment.controller.js`

En la función `generateQR`, cambiar:

```js
// Cambiar esto:
const { qrDataURL } = await generateBCBQR(paymentData);

// Por esto:
const { qrText, qrDataURL } = await generateBCBQR(paymentData);

// Y en el return, agregar qrText:
res.status(201).json({ payment, qrCode: qrDataURL, qrText });
```

**Commit:** `fix: retornar qrText además de qrDataURL en generateQR`

---

#### Bugs menores (m1, m2) — No requieren fix inmediato

Los bugs menores (timestamps en Room y Service, defaults en campos opcionales) no bloquean la app. Se pueden dejar como están y corregir después si hay tiempo.

---

### Checklist de verificación para Erick (después de todos los fixes)

```bash
# 1. Probar el servidor arranca
cd server
npm install
npm run dev
# Debe mostrar "MongoDB conectado" y "Servidor corriendo en puerto 5000"

# 2. Probar registro SIN role (debe crear solo 'cliente')
POST /api/auth/register   { "name": "test", "email": "test@test.com", "password": "123456" }
# Verificar que role es 'cliente', NO lo que se envíe en el body

# 3. Probar que NO se puede registrar como admin
POST /api/auth/register   { "name": "hacker", "email": "hacker@test.com", "password": "123456", "role": "admin" }
# Verificar que role sigue siendo 'cliente'

# 4. Probar login
POST /api/auth/login   { "email": "test@test.com", "password": "123456" }
# Guardar el token para los siguientes tests

# 5. Probar crear reserva con fechas solapadas (debe fallar)
POST /api/bookings   { "roomId": "...", "checkIn": "...", "checkOut": "...", "paymentMethod": "qr_simple" }
# Crear otra reserva con las mismas fechas → debe dar error 400

# 6. Probar dashboard endpoints
GET /api/dashboard/summary
GET /api/dashboard/occupancy
GET /api/dashboard/revenue
GET /api/dashboard/top-rooms
# Todos deben devolver JSON con datos

# 7. Probar asignar limpieza a un NO-empleado (debe fallar)
POST /api/cleaning/assign   { "roomId": "...", "employeeId": "<id_de_cliente>" }
# Debe dar error 400

# 8. Probar iniciar tarea que no está pendiente (debe fallar)
PATCH /api/cleaning/<task_id>/start   (cuando task ya está en_progreso)
# Debe dar error 400
```

---

<a id="-erick--fase-2-frontend-parte-1"></a>
## 🟩 ERICK — FASE 2: Frontend (Parte 1)

> **Prerrequisito:** Haber terminado todos los fixes de Fase 1. Haber hecho `git pull origin main`.  
> **Objetivo:** Crear la infraestructura del frontend + componentes base + páginas públicas.  
> **Duración estimada:** 3-4 días  

### Archivos que Erick crea/modifica

| # | Archivo | Descripción |
|---|---|---|
| E1 | `client/src/services/api.js` | Instancia de axios + todas las APIs (authAPI, roomAPI, bookingAPI, cleaningAPI, userAPI, serviceAPI, dashboardAPI, paymentAPI) |
| E2 | `client/src/context/AuthContext.jsx` | Provider con user, token, loading, login(), register(), logout(), auto-verificación de sesión |
| E3 | `client/src/components/ui/LoadingSpinner.jsx` | Spinner centrado con animate-spin de Tailwind |
| E4 | `client/src/components/ui/EmptyState.jsx` | Mensaje "No hay datos" con icono Props: message, icon |
| E5 | `client/src/components/ui/ProtectedRoute.jsx` | Wrapper que verifica autenticación y rol. Props: children, allowedRoles |
| E6 | `client/src/components/ui/RoomCard.jsx` | Tarjeta de habitación con imagen, tipo, precio, capacidad, estado. Props: room, onClick |
| E7 | `client/src/components/ui/BookingCard.jsx` | Tarjeta de reserva con habitación, fechas, estado, precio. Props: booking, onCancel, onReview |
| E8 | `client/src/components/layout/Navbar.jsx` | Barra de navegación responsiva con links según rol. Menú hamburguesa en móvil |
| E9 | `client/src/components/layout/Footer.jsx` | Footer con copyright y links |
| E10 | `client/src/components/layout/Layout.jsx` | Wrapper: Navbar + children + Footer |
| E11 | `client/src/pages/public/HomePage.jsx` | Hero section, servicios destacados, habitaciones populares, CTA |
| E12 | `client/src/pages/public/RoomsPage.jsx` | Filtros (tipo, precio, capacidad) + grid de RoomCards |
| E13 | `client/src/pages/public/RoomDetailPage.jsx` | Galería, info, servicios, calendario de fechas, cálculo de precio, botón reservar |
| E14 | `client/src/pages/public/LoginPage.jsx` | Formulario login con email/password. Link a register |
| E15 | `client/src/pages/public/RegisterPage.jsx` | Formulario register con name/email/password/confirmPassword |

### Instrucciones detalladas

---

#### E1 — `client/src/services/api.js`

Crear instancia de axios con baseURL `/api` (usa el proxy de Vite). Interceptor para añadir token JWT del localStorage al header Authorization.

Exportar 8 objetos de API:

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

export const paymentAPI = {
    generateQR: (data) => api.post('/payments/generate-qr', data),
    registerTigoMoney: (data) => api.post('/payments/tigo-money', data),
    uploadComprobante: (id, data) => api.post(`/payments/${id}/comprobante`, data),
    getMyPayments: () => api.get('/payments/me'),
    getAll: (params) => api.get('/payments', { params }),
    verify: (id) => api.post(`/payments/${id}/verify`),
};
```

**Commit:** `feat: crear servicio de API con 8 objetos de endpoints`

---

#### E2 — `client/src/context/AuthContext.jsx`

Provider con useState para `user`, `token`, `loading`. Funciones: `login()`, `register()`, `logout()`. Efecto al montar: si hay token en localStorage, llamar a `authAPI.getMe()` para restaurar sesión.

**Commit:** `feat: crear AuthContext con login, register, logout y auto-verificación`

---

#### E3-E7 — Componentes UI

Cada componente en su archivo correspondiente. Seguir las especs del README original (secciones 6-10 para Alejandro).

- `LoadingSpinner.jsx`: `<div className="flex items-center justify-center min-h-[200px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`
- `EmptyState.jsx`: Props `message`, `icon`. Mostrar icono + mensaje centrado.
- `ProtectedRoute.jsx`: Si no autenticado → redirigir a `/login`. Si no tiene rol → mensaje "No autorizado". Si tiene rol permitido → renderizar children.
- `RoomCard.jsx`: Card con imagen, number, type (badge), pricePerNight, capacity, status (badge de colores). Botón "Ver detalle" que llama a `onClick(room)`.
- `BookingCard.jsx`: Card con room number, checkIn/checkOut, status (badge con colores), totalPrice. Botones condicionales: Cancelar (si pendiente), Calificar (si completada sin review).

**Commit por componente:** `feat: crear componente [nombre]`

---

#### E8-E10 — Componentes Layout

- `Navbar.jsx`: Logo "ByteHotel" a la izquierda. Links según rol:
  - No autenticado: Home, Habitaciones, Login, Register
  - Cliente: Home, Habitaciones, Mis Reservas, Perfil, Logout
  - Empleado: Panel Limpieza, Logout
  - Admin: Dashboard, Habitaciones, Reservas, Usuarios, Servicios, Limpieza, Pagos, Logout
  - Menú hamburguesa en móvil
- `Footer.jsx`: `<footer className="bg-gray-800 text-white text-center py-4 mt-auto">© 2025 ByteHotel. Todos los derechos reservados.</footer>`
- `Layout.jsx`: `<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Outlet /></main><Footer /></div>`

**Commit por componente:** `feat: crear componente layout [nombre]`

---

#### E11-E15 — Páginas Públicas

- `HomePage.jsx`: Hero section con imagen de fondo y CTA "Ver habitaciones", sección de servicios con iconos (usar react-icons), grid de 4 RoomCards con habitaciones populares.
- `RoomsPage.jsx`: Sidebar de filtros (tipo select, precio min/max, capacidad select). Grid de RoomCards. Al hacer clic en una → `/habitaciones/:id`.
- `RoomDetailPage.jsx`: Usar `useParams()` para obtener `:id`. Fetch con `roomAPI.getById(id)`. Galería de imágenes (simple grid). Info: number, type badge, pricePerNight, capacity, description, services. Calendario con react-datepicker (rango de fechas). Cálculo dinámico: nights × pricePerNight = subtotal. Botón "Reservar ahora" → navegar a `/reservar` con state.
- `LoginPage.jsx`: Formulario con email y password. Validar campos vacíos. Llamar a `authAPI.login()`. Guardar token en localStorage. Redirigir según rol. Toast de éxito/error con react-hot-toast.
- `RegisterPage.jsx`: Formulario con name, email, password, confirmPassword. Validar. Llamar a `authAPI.register()`. Guardar token. Redirigir a home. Link a login.

**Commit por página:** `feat: crear página pública [nombre]`

---

<a id="-alejandro--fase-2-frontend-parte-2"></a>
## 🟦 ALEJANDRO — FASE 2: Frontend (Parte 2)

> **Prerrequisito:** Haber hecho `git pull origin main`. Erick ya debe haber pusheado api.js, AuthContext y componentes UI/Layout. Alejandro puede empezar en paralelo usando mock data.  
> **Objetivo:** Crear todas las páginas protegidas (cliente, empleado, admin).  
> **Duración estimada:** 4-5 días  

### Primero: Correcciones menores de infraestructura

Antes de empezar con las páginas, Alejandro debe hacer estas correcciones rápidas:

---

#### A0a — Corregir `client/index.html`

```html
<!-- Cambiar estos valores: -->
<html lang="es">  <!-- era: lang="en" -->
<title>ByteHotel</title>  <!-- era: title="client" -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<body class="bg-gray-50 min-h-screen">  <!-- era: sin clases -->
```

**Commit:** `fix: corregir lang, title y body classes en index.html`

---

#### A0b — Limpiar `client/src/index.css`

Eliminar TODO el contenido excepto la primera línea. El archivo debe quedar así:

```css
@import "tailwindcss";
```

**Commit:** `fix: limpiar index.css dejando solo import de tailwindcss`

---

#### A0c — Eliminar `client/src/App.css`

Borrar el archivo `client/src/App.css` completamente.

**Commit:** `fix: eliminar App.css default de Vite`

---

#### A0d — Corregir `client/src/main.jsx` (si es necesario)

Verificar que traiga correctamente App y Tailwind:

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

**Commit (si se cambió):** `fix: corregir main.jsx`

---

### Archivos que Alejandro crea

| # | Archivo | Descripción |
|---|---|---|
| A1 | `client/src/pages/cliente/BookingConfirmPage.jsx` | Resumen de reserva, selección de método de pago real (QR/Tigo/Transferencia/Efectivo) |
| A2 | `client/src/pages/cliente/MyBookingsPage.jsx` | Historial de reservas con cancelar y calificar |
| A3 | `client/src/pages/cliente/ProfilePage.jsx` | Datos del usuario, editar nombre/teléfono, cambiar contraseña |
| A4 | `client/src/pages/empleado/CleaningPanelPage.jsx` | Lista de tareas de limpieza con botones iniciar/completar |
| A5 | `client/src/pages/admin/DashboardPage.jsx` | Cards de métricas + gráficos Recharts (dona, barras) |
| A6 | `client/src/pages/admin/AdminRoomsPage.jsx` | Tabla CRUD de habitaciones con modales |
| A7 | `client/src/pages/admin/AdminUsersPage.jsx` | Tabla CRUD de usuarios con selector de rol |
| A8 | `client/src/pages/admin/AdminServicesPage.jsx` | Tabla CRUD de servicios |
| A9 | `client/src/pages/admin/AdminBookingsPage.jsx` | Tabla de todas las reservas con filtros y cambio de estado |
| A10 | `client/src/pages/admin/AdminCleaningPage.jsx` | Tabla de tareas de limpieza, botón asignar |
| A11 | `client/src/pages/admin/AdminPaymentsPage.jsx` | Tabla de pagos con filtros, botón verificar pago |

---

### Instrucciones detalladas

---

#### A1 — `client/src/pages/cliente/BookingConfirmPage.jsx`

**Página MÁS IMPORTANTE del flujo de reserva.** Recibe roomId, checkIn, checkOut por `location.state` o query params.

Secciones:
1. **Resumen de la habitación** — Image, number, type badge
2. **Fechas seleccionadas** — Check-in, check-out, noches totales
3. **Precio base** — room.pricePerNight × nights
4. **Servicios adicionales** — Checkboxes con name, description, price. Al marcar, se suma al total
5. **Total a pagar** — Grande y destacado (en Bs.)
6. **Selección de método de pago REAL** (NO simulación):
   - Radio buttons: QR Simple (BCB), Tigo Money, Transferencia Bancaria, Efectivo
   - **QR Simple**: Al seleccionar → llama a `paymentAPI.generateQR({ bookingId })` → muestra QR generado. Texto: "Escanee este QR con la app de su banco."
   - **Tigo Money**: Al seleccionar → llama a `paymentAPI.registerTigoMoney({ bookingId })` → muestra número Tigo Money del hotel y monto. Texto: "Transfiera Bs. [monto] al [número]."
   - **Transferencia**: Al seleccionar → muestra datos bancarios (del .env vía API si existe, o hardcodear temporalmente). Botón para subir comprobante con `paymentAPI.uploadComprobante(id, formData)`.
   - **Efectivo**: Al seleccionar → muestra "Puede pagar en efectivo en la recepción del hotel."
7. **Botón "Confirmar Reserva"** → Llama a `bookingAPI.create(data)` con método de pago seleccionado. Toast de éxito. Redirige a `/mis-reservas`.

**Commit:** `feat: crear BookingConfirmPage con métodos de pago reales`

---

#### A2 — `client/src/pages/cliente/MyBookingsPage.jsx`

- Título "Mis Reservas"
- Fetch con `bookingAPI.getMyBookings()`
- Lista de BookingCards
- Cada card: botón "Cancelar" si status pendiente, botón "Calificar" si completada sin review
- Modal para escribir review (estrellas 1-5 + comentario textarea)
- Al calificar: `bookingAPI.createReview(bookingId, { rating, comment })`

**Commit:** `feat: crear MyBookingsPage con cancelar y calificar`

---

#### A3 — `client/src/pages/cliente/ProfilePage.jsx`

- Fetch con `authAPI.getMe()`
- Mostrar name, email, phone, role (badge)
- Botón editar → formulario para name y phone
- Botón cambiar contraseña → modal con password actual, nueva password, confirmar
- Toast de éxito/error

**Commit:** `feat: crear ProfilePage`

---

#### A4 — `client/src/pages/empleado/CleaningPanelPage.jsx`

- Fetch con `cleaningAPI.getMyTasks()`
- Lista de tareas con: número de habitación, tipo, status badge
- Si pendiente → botón verde "Iniciar limpieza" → `cleaningAPI.start(taskId)`
- Si en_progreso → botón azul "Completar limpieza" → `cleaningAPI.complete(taskId)`
- Si completada → texto gris "Completada"
- Toast al completar

**Commit:** `feat: crear CleaningPanelPage para empleados`

---

#### A5 — `client/src/pages/admin/DashboardPage.jsx`

- 4 cards superiores: Ocupación (%), Ingresos del mes (Bs.), Reservas activas (n), Calificación promedio (★)
- Fetch con `dashboardAPI.getSummary()`
- 3 gráficos con Recharts:
  - Gráfico de dona: Ocupación por tipo → `dashboardAPI.getOccupancyData()`
  - Gráfico de barras: Ingresos mensuales → `dashboardAPI.getRevenueData()`
  - Gráfico de barras horizontal: Top 5 habitaciones → `dashboardAPI.getTopRooms()`

**Commit:** `feat: crear DashboardPage con métricas y gráficos`

---

#### A6 — `client/src/pages/admin/AdminRoomsPage.jsx`

- Fetch con `roomAPI.getAll()` y `serviceAPI.getAll()`
- Tabla: Número, Tipo (badge), Precio, Capacidad, Estado (badge), Acciones
- Botón "Añadir habitación" → modal con formulario (number, type select, pricePerNight, capacity, description, services checkboxes)
- Botón editar → modal pre-llenado
- Botón eliminar → confirmación
- Botón cambiar estado → select

**Commit:** `feat: crear AdminRoomsPage con CRUD`

---

#### A7 — `client/src/pages/admin/AdminUsersPage.jsx`

- Fetch con `userAPI.getAll()`
- Tabla: Nombre, Email, Rol (badge: cliente=azul, empleado=verde, admin=rojo), Teléfono, Acciones
- Botón "Crear usuario" → modal con name, email, password, role (select), phone
- Botón eliminar → confirmación
- No permite eliminarse a sí mismo

**Commit:** `feat: crear AdminUsersPage con CRUD`

---

#### A8 — `client/src/pages/admin/AdminServicesPage.jsx`

- Fetch con `serviceAPI.getAll()`
- Tabla: Icono, Nombre, Descripción, Precio (Bs.), Acciones
- Botón "Añadir servicio" → modal con name, description, price, icon
- Botón editar → modal pre-llenado
- Botón eliminar → confirmación

**Commit:** `feat: crear AdminServicesPage con CRUD`

---

#### A9 — `client/src/pages/admin/AdminBookingsPage.jsx`

- Fetch con `bookingAPI.getAll()`
- Tabla: Cliente, Habitación, Check-in, Check-out, Total (Bs.), Estado (badge), Acciones
- Filtros por estado (select)
- Botón cambiar estado → select en la fila (pendiente→confirmada, confirmada→en_curso, etc.)

**Commit:** `feat: crear AdminBookingsPage con filtros`

---

#### A10 — `client/src/pages/admin/AdminCleaningPage.jsx`

- Fetch con `cleaningAPI.getAll()` y `userAPI.getAll({ role: 'empleado' })` (para dropdown)
- Tabla: Habitación, Empleado, Estado (badge), Inicio, Fin, Duración
- Botón "Asignar tarea" → modal: select habitación (solo sucias), select empleado (solo empleados)
- Card superior: tiempo promedio de limpieza

**Commit:** `feat: crear AdminCleaningPage con asignación de tareas`

---

#### A11 — `client/src/pages/admin/AdminPaymentsPage.jsx`

- Fetch con `paymentAPI.getAll()`
- Tabla: ID Reserva, Cliente, Método (badge: QR Simple=verde, Tigo Money=azul, Transferencia=amarillo, Efectivo=gris), Monto (Bs.), Estado (badge: pendiente=naranja, completado=verde, fallido=rojo), Fecha
- Filtros por método y estado
- Botón "Verificar pago" en filas con estado pendiente → modal con detalle:
  - QR Simple: monto, fecha, botón "Confirmar pago" → `paymentAPI.verify(id)`
  - Tigo Money: número, monto, botón "Confirmar pago" → `paymentAPI.verify(id)`
  - Transferencia: datos bancarios, comprobante (imagen si existe), botón "Confirmar pago" → `paymentAPI.verify(id)`
  - Efectivo: botón "Confirmar cobro en recepción" → `paymentAPI.verify(id)`
- Al confirmar: toast éxito, actualizar tabla

**Commit:** `feat: crear AdminPaymentsPage con verificación de pagos`

---

<a id="-alex--fase-2-frontend-parte-3"></a>
## 🟨 ALEX — FASE 2: Frontend (Parte 3)

> **NOTA:** Si Alex se incorpora, se le asignan los componentes y páginas que Alejandro no pueda terminar. Si Alex no se incorpora, Alejandro asume todo el bloque A.

**Si Alex se incorpora, se le asigna:**

| # | Archivo | Descripción |
|---|---|---|
| X1 | `client/src/pages/admin/DashboardPage.jsx` | Si Alejandro no lo terminó |
| X2 | `client/src/pages/admin/AdminPaymentsPage.jsx` | Si Alejandro no lo terminó |
| X3 | `client/src/App.jsx` | Montar todas las rutas con BrowserRouter, AuthProvider, Layout, ProtectedRoute |
| X4 | `client/src/main.jsx` | Renderizar App con StrictMode |
| X5 | `client/index.html` | Corregir lang, title, body classes |

---

## FLUJO DE TRABAJO

```
Día 1-2: ERICK → Fase 1 (corregir todos los bugs del backend)
    ↓
    git push origin main
    ↓
Día 2-3: ALEJANDRO → git pull → Hacer A0a-A0d (correcciones menores)
    ↓
Día 3+: ERICK y ALEJANDRO trabajan EN PARALELO
    ├── ERICK → E1-E15 (api.js, AuthContext, componentes, páginas públicas)
    ├── ALEJANDRO → A1-A11 (páginas cliente, empleado, admin)
    ↓
    Ambos hacen git pull frecuentemente
    ↓
Día 6-7: ÚLTIMO
    ├── ERICK → A1-A11 si Alex no se incorpora (o lo que falte)
    ├── ALEJANDRO → X3-X5 (App.jsx, main.jsx, index.html)
    ↓
    Probar flujo completo: registro → login → habitaciones → reservar → pagar → admin verifica
    ↓
    Commit final y push
```

### Reglas de coordinación

1. **ERICK hace push primero** (después de corregir bugs). Alejandro hace `git pull` antes de empezar.
2. **ERICK pushea api.js y AuthContext primero** (E1-E2). Alejandro necesita estos archivos.
3. **Ambos hacen pull frecuentemente** (mínimo 2 veces al día).
4. **Commits atómicos:** 1 archivo = 1 commit con mensaje descriptivo.
5. **Si hay conflicto:** Comunicar por el grupo inmediatamente.
6. **No tocar archivos del otro sin pedir permiso.**

---

## DEPENDENCIAS DE ARCHIVOS

```
ERICK E1 (api.js) ← NECESITA backend corregido (Fase 1)
ERICK E2 (AuthContext) ← NECESITA E1
ERICK E3-E10 (componentes) ← NECESITA E2
ERICK E11-E15 (páginas públicas) ← NECESITA E3-E10

ALEJANDRO A0 (correcciones) ← INDEPENDIENTE
ALEJANDRO A1-A11 (páginas) ← NECESITA E1+E2 (api.js + AuthContext)
ALEJANDRO puede empezar con A0 inmediatamente
ALEJANDRO puede usar MOCK DATA mientras Erick no haya pusheado E1+E2
ALEJANDRO debe hacer git pull cuando Erick pushee E1+E2 y conectar con API real
```