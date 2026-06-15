# 📘 PLAN DE TRABAJO FINAL — ByteHotel

> **Grupo:** ByteHotel  
> **Integrantes:** Erick Ferrel, Alejandro Rocabado  
> **Fase:** Corrección de bugs del backend + Implementación completa del frontend  
> **Documento base:** README.md (guía técnica del proyecto)  
> **Fecha:** Junio 2026  

---

> ## 🚫 NO HACER MERGE DE LA RAMA `Frontend`
> 
> Existe una rama `Frontend` en el repositorio que **NO se debe mergear a main**. Tiene problemas críticos:
> 
> | Problema | Detalle |
> |---|---|
> | Eliminó TODO el backend | Los 40+ archivos de `server/` (modelos, controllers, routes, middleware, utils) fueron borrados |
> | Eliminó `PLAN_TRABAJO.md` | Se borró este documento |
> | Vació `README.md` | Toda la guía técnica fue reemplazada por el default de Vite |
> | Cambió la estructura | Movió `client/src/` a `src/` en la raíz, rompiendo los scripts del `package.json` |
> | `Login.jsx` no usa AuthContext | Hace manualmente `localStorage.setItem` en vez de usar `AuthContext.login()` |
> | `Login.jsx` redirige siempre a `/admin` | No diferencia roles |
> | `AuthContext.jsx` no tiene `register` | Solo tiene `login` y `logout` |
> | `PrivateRoute.jsx` usa `role` (string) | Debería usar `allowedRoles` (array) |
> | `App.jsx` solo tiene 3 rutas | Faltan ~15 rutas |
> | `Navbar.jsx` admin incompleto | Solo tiene 2 links, faltan 5 |
> | `Dashboard.jsx` apunta a `/dashboard/stats` | Debería ser `/dashboard/summary` |
> 
> **Si alguien quiere reutilizar código de esa rama, debe copiarlo manualmente y corregirlo según las instrucciones de este documento.**

---

## 📑 ÍNDICE

| # | Sección | Descripción |
|---|---|---|
| 1 | [Antes de Empezar](#-antes-de-empezar) | Reglas y prerrequisitos |
| 2 | [Resumen de Bugs Encontrados](#-resumen-de-bugs-encontrados) | Evaluación completa del backend |
| 3 | [Resumen del Frontend Pendiente](#-resumen-del-frontend-pendiente) | Estado actual del frontend |
| 4 | [Distribución del Trabajo](#-distribución-del-trabajo) | Qué hace cada quién |
| 5 | [ERICK — Corrección de Backend](#-erick--corrección-de-backend) | 9 bugs críticos + bugs medios |
| 6 | [ALEJANDRO — Frontend Parte 1](#-alejandro--frontend-parte-1) | Infraestructura + componentes + páginas públicas + cliente/empleado |
| 7 | [ERICK — Frontend Parte 2](#-erick--frontend-parte-2) | Páginas admin (después de terminar el backend) |
| 8 | [Archivo Final: App.jsx](#-archivo-final-appjsx) | Ensamblaje de rutas (cuando ambos terminen) |
| 9 | [Flujo de Trabajo](#-flujo-de-trabajo) | Timeline y coordinación |
| 10 | [Checklist Final](#-checklist-final) | Verificación de la entrega |

---

<a id="-antes-de-empezar"></a>
## ⚠️ ANTES DE EMPEZAR

### Reglas del equipo

| # | Regla |
|---|---|
| 1 | **Nadie toca archivos que no le corresponden sin avisar al grupo.** |
| 2 | **Siempre `git pull origin main` antes de `git push`.** |
| 3 | **Commits pequeños:** 1 fix = 1 commit, 1 componente = 1 commit. |
| 4 | **Probar antes de pushear:** cada endpoint y cada página. |
| 5 | **El `.env` NUNCA se sube a git.** |
| 6 | **Si algo falla, preguntar al grupo.** No adivinar. |
| 7 | **Trabajar en ramas separadas, NO en main directamente.** Hacer merge solo cuando el líder apruebe. |

### 🌿 Convención de Ramas

**Cada integrante trabaja en su propia rama. NO se trabaja directamente en `main`.**

| Integrante | Rama | Comando para crear |
|---|---|---|
| Erick | `feature/erick-backend-fixes` | `git checkout -b feature/erick-backend-fixes` |
| Erick (admin pages) | `feature/erick-admin-frontend` | `git checkout -b feature/erick-admin-frontend` |
| Alejandro | `feature/alejandro-frontend` | `git checkout -b feature/alejandro-frontend` |

**Flujo de trabajo por rama:**

```bash
# 1. Crear tu rama (SOLO LA PRIMERA VEZ)
git checkout -b feature/erick-backend-fixes

# 2. Trabajar y hacer commits
git add .
git commit -m "fix: descripción del cambio"

# 3. Antes de push, actualizar tu rama con main
git fetch origin
git merge origin/main

# 4. Resolver conflictos si los hay, luego push
git push origin feature/erick-backend-fixes

# 5. Crear Pull Request en GitHub para que el líder revise
# Ir a https://github.com/NihahtMontes/Proyecto-Web-Final/compare
# Base: main ← Compare: feature/erick-backend-fixes
# El líder revisa y hace merge
```

**Regla de merge:**
- Solo el **líder del equipo** (Monte) hace merge a `main`.
- Se hace merge cuando la rama pasa pruebas básicas y no rompe nada.
- Después de cada merge a main, **todos** hacen `git pull origin main` y luego `git merge origin/main` en su rama.

### Estructura del Proyecto

> **IMPORTANTE:** La estructura del frontend es `client/src/`. NO usar `src/` en la raíz.

```
booking-hotel/
├── client/                    # Frontend (Alejandro)
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
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                    # Backend (Erick + Alejandro fundación)
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── index.js
│   └── package.json
├── .gitignore
├── package.json               # Raíz (scripts compartidos)
├── README.md                  # Guía técnica
└── PLAN_TRABAJO.md            # Este documento
```

### Prerrequisitos

Ambos deben tener:
- Node.js 18.x o 20.x LTS (`node -v`)
- npm 9.x+ (`npm -v`)
- MongoDB corriendo (local o Atlas)
- `git pull origin main` ejecutado antes de empezar
- Su rama creada y activa (`git branch` para verificar)

---

<a id="-resumen-de-bugs-encontrados"></a>
## 🔍 RESUMEN DE BUGS ENCONTRADOS

### BUGS CRÍTICOS (bloquean la aplicación)

| # | Archivo | Bug | Solución |
|---|---|---|---|
| C1 | `auth.controller.js:23` | `register` acepta `role` del body. Cualquier usuario puede autoregistrarse como admin | Eliminar `role` del destructuring, forzar `role: 'cliente'` |
| C2 | `booking.controller.js` | `createBooking` no valida solapamiento de fechas. Dos reservas pueden overlapping | Agregar validación de solapamiento antes de crear la reserva |
| C3 | `dashboard.controller.js` | Solo existe `getDashboardStats`. Faltan `getSummary`, `getOccupancyData`, `getRevenueData`, `getTopRooms` | Implementar las 4 funciones con aggregation pipelines |
| C4 | `dashboard.routes.js` | Solo 1 ruta `/stats` en vez de 4 (`/summary`, `/occupancy`, `/revenue`, `/top-rooms`) | Agregar las 4 rutas con sus controladores |
| C5 | `dashboard.controller.js:12` | Usa `status: 'ocupada'` pero el modelo Room tiene `'ocupado'`. Siempre retorna 0 | Cambiar `'ocupada'` por `'ocupado'` |
| C6 | `cleaning.controller.js` | `assignTask` no verifica que `employeeId` tenga rol `'empleado'` | Agregar verificación de rol antes de asignar |
| C7 | `cleaning.controller.js` | `startTask` no verifica que status sea `'pendiente'` | Agregar verificación de status |
| C8 | `cleaning.controller.js` | `completeTask` no verifica que status sea `'en_progreso'` | Agregar verificación de status |
| C9 | `server/package.json` | **NO EXISTE**. Dependencias están en la raíz. El server no puede arrancar | Crear `server/package.json` con todas las dependencias |

### BUGS MEDIOS (funcionalidad incompleta)

| # | Archivo | Bug | Solución |
|---|---|---|---|
| M1 | `email.js` | 3 de 4 funciones son stubs vacíos: `sendCheckInReminder`, `sendCheckOutReminder`, `sendReviewInvitation` | Implementar las 3 funciones |
| M2 | `index.js` (cron) | Cron de check-out no envía email de invitación a calificar | Agregar `sendReviewInvitation` en el cron |
| M3 | `.env` | 6 variables vacías: `CLOUDINARY_*`, `RAPIDAPI_KEY`, `EMAIL_USER`, `EMAIL_PASS` | Llenar con valores reales (compartir por privado) |
| M4 | `client/index.html` | `lang="en"` en vez de `"es"`, título `"client"`, sin clases en `<body>` | Corregir los 3 valores |
| M5 | `client/src/index.css` | 110+ líneas de CSS default de Vite que interfieren con Tailwind | Eliminar todo excepto `@import "tailwindcss";` |
| M6 | `client/src/App.css` | Archivo no especificado, interfiere con Tailwind | Eliminar archivo |

### BUGS MENORES (no bloquean)

| # | Archivo | Bug |
|---|---|---|
| m1 | `Room.js` | `timestamps: true` inconsistente con otros modelos |
| m2 | `Service.js` | `timestamps: true` inconsistente con otros modelos |
| m3 | Varios modelos | Defaults en campos opcionales no están en el spec |
| m4 | `cloudinary.js` | Usa `fileBuffer` en vez de `filePath` |
| m5 | `payment.controller.js` | `generateQR` no retorna `qrText` |
| m6 | `auth.controller.js` | Console.log en `login` expone emails |

---

<a id="-resumen-del-frontend-pendiente"></a>
## 🖥️ RESUMEN DEL FRONTEND PENDIENTE

El frontend actual es **100% Vite default** (counter demo). No se ha implementado nada.

### Estado de archivos

| Archivo | Estado |
|---|---|
| `client/index.html` | ❌ Valores incorrectos (lang, title, body) |
| `client/src/index.css` | ❌ 110+ líneas de CSS default |
| `client/src/App.css` | ❌ Debe eliminarse |
| `client/src/main.jsx` | ⚠️ Estilo diferente al spec |
| `client/src/App.jsx` | ❌ Es el counter demo de Vite, NO el router |
| `client/src/services/api.js` | ❌ NO EXISTE |
| `client/src/context/AuthContext.jsx` | ❌ NO EXISTE |
| 5 componentes UI | ❌ NO EXISTEN |
| 3 componentes layout | ❌ NO EXISTEN |
| 5 páginas públicas | ❌ NO EXISTEN |
| 3 páginas cliente | ❌ NO EXISTEN |
| 1 página empleado | ❌ NO EXISTEN |
| 7 páginas admin | ❌ NO EXISTEN |

**Total: ~30 archivos por crear.**

### 💡 Código Reutilizable de la Rama `Frontend`

> La rama `Frontend` tiene código que **sirve como referencia** pero necesita correcciones. **NO hacer merge.** Copiar manualmente y corregir.

| Archivo | ¿Sirve? | Correcciones necesarias |
|---|---|---|
| `src/services/api.js` | ✅ Buena base | Cambiar `baseURL` de `'http://localhost:5000/api'` a `'/api'` (usar proxy de Vite). Guardar en `client/src/services/api.js` |
| `src/context/AuthContext.jsx` | ⚠️ Incompleto | Agregar función `register(name, email, password)`. Guardar `user` en localStorage al hacer login |
| `src/components/layout/Navbar.jsx` | ⚠️ Incompleto | Admin solo tiene 2 links (Dashboard, Habitaciones). Faltan: Reservas, Usuarios, Servicios, Limpieza, Pagos. Usar `allowedRoles` en vez de `role` |
| `src/components/layout/Layout.jsx` | ⚠️ Pequeño fix | Usar `<Outlet />` en vez de `{children}` con el pattern de React Router v7 |
| `src/components/layout/Footer.jsx` | ✅ OK | Copiar tal cual a `client/src/components/layout/Footer.jsx` |
| `src/components/auth/PrivateRoute.jsx` | ❌ Bug | Usa `role` (string). Cambiar a `allowedRoles` (array): `if (allowedRoles && !allowedRoles.includes(user.role))` |
| `src/pages/Home.jsx` | ✅ Buena base | Agregar fetch de habitaciones y servicios. Copiar a `client/src/pages/public/HomePage.jsx` |
| `src/pages/Login.jsx` | ❌ Bug | No usa AuthContext. Redirige siempre a `/admin`. Reescribir usando `AuthContext.login()` y redirigir según rol |
| `src/pages/AdminDashboard.jsx` | ⚠️ Solo placeholder | Necesita dashboards con Recharts, fetch de `dashboardAPI.getSummary()`, etc. |
| `src/pages/Dashboard.jsx` | ❌ Bug | Apunta a `/dashboard/stats` (no existe). Debe apuntar a `/dashboard/summary` |
| `src/App.jsx` | ❌ Incompleto | Solo 3 rutas. Faltan ~15 rutas. Reescribir según la spec de este documento |

**Cómo copiar código de la rama Frontend sin hacer merge:**

```bash
# Ejemplo: copiar solo Footer.jsx de la rama Frontend
git show origin/Frontend:src/components/layout/Footer.jsx > client/src/components/layout/Footer.jsx

# Ejemplo: copiar api.js y corregir baseURL manualmente después
git show origin/Frontend:src/services/api.js > client/src/services/api.js
# Luego editar y cambiar baseURL a '/api'
```

---

<a id="-distribución-del-trabajo"></a>
## 📋 DISTRIBUCIÓN DEL TRABAJO

### En paralelo (simultáneamente)

| Erick 🌿 `feature/erick-backend-fixes` | Alejandro 🌿 `feature/alejandro-frontend` |
|---|---|
| Corrige TODOS los bugs del backend (C1-C9 + M1-M6) | Crea TODA la infraestructura del frontend + páginas públicas + cliente/empleado |

### Después (secuencial)

| Erick 🌿 `feature/erick-admin-frontend` |
|---|
| Cuando termine el backend → Crea las 7 páginas admin del frontend |

### Por qué esta distribución

1. **Erick** construyó el backend → conoce los bugs y sabe cómo arreglarlos rápido.
2. **Alejandro** puede crear el frontend sin depender de que el backend esté arreglado (usa mock data mientras tanto).
3. **Trabajan en simultáneo en ramas separadas** → se ahorra tiempo y no hay conflictos.
4. **Erick hace admin después** → ya conoce los endpoints que él mismo arregló, puede conectar el dashboard y las tablas admin sin adivinar.
5. **Solo se mergea a main cuando el líder aprueba** → calidad controlada.

### Archivos por persona

| Erick (Backend + Admin Pages) | Alejandro (Frontend Core) |
|---|---|
| `auth.controller.js` (fix) | `client/index.html` (fix) |
| `booking.controller.js` (fix) | `client/src/index.css` (fix) |
| `dashboard.controller.js` (reescribir) | `client/src/App.css` (eliminar) |
| `dashboard.routes.js` (reescribir) | `client/src/main.jsx` (fix) |
| `cleaning.controller.js` (fix) | `client/vite.config.js` (verificar) |
| `server/package.json` (nuevo) | `client/package.json` (verificar deps) |
| `email.js` (implementar stubs) | `client/src/services/api.js` (nuevo) |
| `index.js` (fix cron) | `client/src/context/AuthContext.jsx` (nuevo) |
| `payment.controller.js` (fix) | `client/src/components/ui/*` (5 archivos nuevos) |
| `server/.env` (llenar variables) | `client/src/components/layout/*` (3 archivos nuevos) |
| `admin/DashboardPage.jsx` (nuevo) | `client/src/pages/public/*` (5 páginas nuevas) |
| `admin/AdminRoomsPage.jsx` (nuevo) | `client/src/pages/cliente/*` (3 páginas nuevas) |
| `admin/AdminUsersPage.jsx` (nuevo) | `client/src/pages/empleado/*` (1 página nueva) |
| `admin/AdminServicesPage.jsx` (nuevo) | |
| `admin/AdminBookingsPage.jsx` (nuevo) | |
| `admin/AdminCleaningPage.jsx` (nuevo) | |
| `admin/AdminPaymentsPage.jsx` (nuevo) | |
| `App.jsx` (montar rutas) | |

---

<a id="-erick--corrección-de-backend"></a>
## 🟩 ERICK — Corrección de Backend

> **Objetivo:** Dejar el backend 100% funcional.  
> **Trabaja en paralelo con Alejandro.**  
> **Cada ítem = 1 commit. Hacer en este orden.**  
> **🌿 Rama:** `feature/erick-backend-fixes`

### Prerrequisito

```bash
git checkout main
git pull origin main
git checkout -b feature/erick-backend-fixes
```

---

#### C1 — Corregir registro de usuario

**Archivo:** `server/controllers/auth.controller.js`

**Problema:** Acepta `role` del body → cualquiera puede registrarse como admin.

**Fix:**

```js
// LÍNEA 23 — Cambiar:
const { name, email, password, role } = req.body;
// Por:
const { name, email, password } = req.body;

// LÍNEA 39 — Cambiar:
role: role || 'cliente',
// Por:
role: 'cliente',
```

**Commit:** `fix: remover role del registro público de usuarios`

---

#### C2 — Agregar validación de solapamiento de fechas

**Archivo:** `server/controllers/booking.controller.js`

**Problema:** No verifica si ya existe una reserva solapada.

**Fix:** Agregar después de buscar la room:

```js
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

**Commit:** `fix: agregar validación de solapamiento de fechas en createBooking`

---

#### C3 + C4 + C5 — Reescribir dashboard controller y routes

**Archivo:** `server/controllers/dashboard.controller.js`

Reemplazar TODO el contenido:

```js
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

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
            { $project: { _id: 1, total: 1, occupied: 1, percentage: { $multiply: [{ $divide: ['$occupied', { $max: ['$total', 1] }] }, 100] } } }
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

Reemplazar TODO el contenido:

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

**Fix en `assignTask`** — Agregar verificación de rol:

```js
const User = require('../models/User');
// ...
const employee = await User.findById(employeeId);
if (!employee || employee.role !== 'empleado') {
    return res.status(400).json({ message: 'El usuario asignado no es un empleado válido' });
}
```

**Fix en `startTask`** — Verificar status:

```js
if (task.status !== 'pendiente') {
    return res.status(400).json({ message: 'La tarea debe estar en estado pendiente para iniciarla' });
}
```

**Fix en `completeTask`** — Verificar status:

```js
if (task.status !== 'en_progreso') {
    return res.status(400).json({ message: 'La tarea debe estar en progreso para completarla' });
}
```

**Commit:** `fix: agregar validaciones de rol y status en cleaning controller`

---

#### C9 — Crear server/package.json

**Archivo nuevo:** `server/package.json`

```json
{
  "name": "booking-hotel-server",
  "version": "1.0.0",
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

Después ejecutar:

```bash
cd server
npm install
```

Y quitar del `package.json` raíz: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `nodemailer`, `cloudinary`, `multer`, `node-cron`, `axios`, `qrcode`. Dejar solo `concurrently`.

**Commit:** `fix: crear server/package.json y mover dependencias backend`

---

#### M1 — Implementar emails faltantes

**Archivo:** `server/utils/email.js`

Implementar las 3 funciones vacías siguiendo el patrón de `sendBookingConfirmation`:

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

#### M2 — Agregar email de review en cron de check-out

**Archivo:** `server/index.js`

En el cron de check-out (00:02), agregar después de cambiar status:

```js
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

**Commit:** `feat: agregar envío de email de invitación a calificar en cron de check-out`

---

#### M5 — Retornar qrText en generateQR

**Archivo:** `server/controllers/payment.controller.js`

```js
// Cambiar:
const { qrDataURL } = await generateBCBQR(paymentData);
// Por:
const { qrText, qrDataURL } = await generateBCBQR(paymentData);

// Y en el return agregar qrText:
res.status(201).json({ payment, qrCode: qrDataURL, qrText });
```

**Commit:** `fix: retornar qrText además de qrDataURL en generateQR`

---

#### M6 — Eliminar console.log en login

**Archivo:** `server/controllers/auth.controller.js`

Eliminar todos los `console.log()` que exponen datos del usuario.

**Commit:** `fix: eliminar console.log que exponen datos sensibles en login`

---

#### Checklist de verificación (Erick)

```bash
# 1. Servidor arranca
cd server && npm install && npm run dev

# 2. Registro sin role → crea solo 'cliente'
POST /api/auth/register { "name":"test", "email":"test@test.com", "password":"123456" }

# 3. Registro con role: "admin" → IGNORA el role, crea 'cliente'
POST /api/auth/register { "name":"hacker", "email":"h@h.com", "password":"123456", "role":"admin" }

# 4. Login funciona
POST /api/auth/login { "email":"test@test.com", "password":"123456" }

# 5. Reserva con fechas solapadas → error 400
POST /api/bookings { ... mismas fechas que otra reserva ... }

# 6. Dashboard endpoints devuelven datos
GET /api/dashboard/summary
GET /api/dashboard/occupancy
GET /api/dashboard/revenue
GET /api/dashboard/top-rooms

# 7. Asignar limpieza a NO-empleado → error 400
POST /api/cleaning/assign { "roomId":"...", "employeeId":"<id_cliente>" }

# 8. Iniciar tarea no pendiente → error 400
PATCH /api/cleaning/<task_id>/start  (cuando ya está en_progreso)
```

---

<a id="-alejandro--frontend-parte-1"></a>
## 🟦 ALEJANDRO — Frontend Parte 1

> **Objetivo:** Crear toda la infraestructura del frontend + componentes + páginas públicas + páginas cliente/empleado.  
> **Trabaja en paralelo con Erick.** Puede empezar AHORA sin esperar a que Erick termine el backend (usa mock data o deja las llamadas API listas para cuando el backend esté arreglado).  
> **Duración estimada:** 4-5 días  
> **🌿 Rama:** `feature/alejandro-frontend`

### Prerrequisito

```bash
git checkout main
git pull origin main
git checkout -b feature/alejandro-frontend
```

---

### Paso 0 — Correcciones de infraestructura (hacer primero)

#### A0a — Corregir `client/index.html`

```html
<html lang="es">  <!-- era: lang="en" -->
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ByteHotel</title>  <!-- era: "client" -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
</head>
<body class="bg-gray-50 min-h-screen">  <!-- era: sin clases -->
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

**Commit:** `fix: corregir lang, title y body classes en index.html`

#### A0b — Limpiar `client/src/index.css`

Eliminar TODO excepto:

```css
@import "tailwindcss";
```

**Commit:** `fix: limpiar index.css dejando solo import de tailwindcss`

#### A0c — Eliminar `client/src/App.css`

```bash
git rm client/src/App.css
```

**Commit:** `fix: eliminar App.css default de Vite`

#### A0d — Corregir `client/src/main.jsx`

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

**Commit:** `fix: corregir main.jsx`

#### A0e — Verificar/Crear `client/vite.config.js`

Si no existe o está vacío, crear con este contenido exacto:

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

> **IMPORTANTE:** El proxy es para que las llamadas a `/api/*` se redirijan al backend en puerto 5000. Sin esto, `api.js` con `baseURL: '/api'` no funciona.

**Commit:** `fix: configurar vite.config.js con proxy y tailwindcss`

#### A0f — Verificar `client/package.json`

Asegurarse de que tenga estas dependencias:

```bash
cd client
npm install react-router-dom axios recharts react-datepicker react-icons react-hot-toast
npm install -D @tailwindcss/vite
```

> Si `package.json` ya tiene estas dependencias, NO reinstalar. Solo verificar.

**Commit:** `chore: verificar dependencias del frontend`

---

### Archivos que Alejandro crea

| # | Archivo | Descripción |
|---|---|---|
| A1 | `client/src/services/api.js` | Axios instance + 8 API objects |
| A2 | `client/src/context/AuthContext.jsx` | AuthProvider con login, register, logout |
| A3 | `client/src/components/ui/LoadingSpinner.jsx` | Spinner con animate-spin |
| A4 | `client/src/components/ui/EmptyState.jsx` | Mensaje "No hay datos" |
| A5 | `client/src/components/ui/ProtectedRoute.jsx` | Wrapper de autenticación y rol |
| A6 | `client/src/components/ui/RoomCard.jsx` | Tarjeta de habitación |
| A7 | `client/src/components/ui/BookingCard.jsx` | Tarjeta de reserva |
| A8 | `client/src/components/layout/Navbar.jsx` | Barra de navegación responsiva |
| A9 | `client/src/components/layout/Footer.jsx` | Footer |
| A10 | `client/src/components/layout/Layout.jsx` | Wrapper Navbar + children + Footer |
| A11 | `client/src/pages/public/HomePage.jsx` | Hero, servicios, habitaciones populares |
| A12 | `client/src/pages/public/RoomsPage.jsx` | Filtros + grid de RoomCards |
| A13 | `client/src/pages/public/RoomDetailPage.jsx` | Galería, info, calendario, reservar |
| A14 | `client/src/pages/public/LoginPage.jsx` | Formulario login |
| A15 | `client/src/pages/public/RegisterPage.jsx` | Formulario register |
| A16 | `client/src/pages/cliente/BookingConfirmPage.jsx` | Resumen + pago real (QR/Tigo/Transferencia/Efectivo) |
| A17 | `client/src/pages/cliente/MyBookingsPage.jsx` | Historial + cancelar + calificar |
| A18 | `client/src/pages/cliente/ProfilePage.jsx` | Datos del usuario + editar |
| A19 | `client/src/pages/empleado/CleaningPanelPage.jsx` | Tareas de limpieza |

---

### Instrucciones detalladas

---

#### A1 — `client/src/services/api.js`

Instancia de axios con `baseURL: '/api'`. Interceptor para JWT. 8 objetos de API:

```js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

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

export default api;
```

**Commit:** `feat: crear servicio de API con 8 objetos de endpoints`

---

#### A2 — `client/src/context/AuthContext.jsx`

Provider con:
- `user` (null si no autenticado)
- `token` (de localStorage)
- `loading` (true mientras verifica)
- `login(email, password)` → authAPI.login(), guarda token, guarda user
- `register(name, email, password)` → authAPI.register(), guarda token
- `logout()` → limpia localStorage, user a null
- useEffect al montar: si hay token → authAPI.getMe() para restaurar sesión

**Commit:** `feat: crear AuthContext con login, register, logout y auto-verificación`

---

#### A3-A7 — Componentes UI

| Componente | Props | Comportamiento |
|---|---|---|
| `LoadingSpinner` | — | `<div className="flex justify-center items-center min-h-[200px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>` |
| `EmptyState` | `message`, `icon` | Icono + mensaje centrado |
| `ProtectedRoute` | `children`, `allowedRoles` | Si no autenticado → redirect `/login`. Si no tiene rol → "No autorizado". Si OK → children |
| `RoomCard` | `room`, `onClick` | Imagen, number, type badge, pricePerNight, capacity, status badge, botón "Ver detalle" |
| `BookingCard` | `booking`, `onCancel`, `onReview` | Room number, checkIn/checkOut, status badge, totalPrice. Botón Cancelar (si pendiente), Calificar (si completada sin review) |

**Commit por componente:** `feat: crear componente [nombre]`

---

#### A8-A10 — Componentes Layout

**Navbar.jsx:**
- Logo "ByteHotel" a la izquierda
- Links según rol:
  - No autenticado: Home, Habitaciones, Login, Register
  - Cliente: Home, Habitaciones, Mis Reservas, Perfil, Logout
  - Empleado: Panel Limpieza, Logout
  - Admin: Dashboard, Habitaciones, Reservas, Usuarios, Servicios, Limpieza, Pagos, Logout
- Menú hamburguesa en móvil

**Footer.jsx:**
```jsx
<footer className="bg-gray-800 text-white text-center py-4 mt-auto">
    © 2025 ByteHotel. Todos los derechos reservados.
</footer>
```

**Layout.jsx:**
```jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
```

**Commit por componente:** `feat: crear componente layout [nombre]`

---

#### A11-A15 — Páginas Públicas

| Página | Descripción |
|---|---|
| `HomePage.jsx` | Hero section con CTA "Ver habitaciones", grid de servicios con iconos (react-icons), grid de 4 RoomCards populares |
| `RoomsPage.jsx` | Sidebar de filtros (tipo select, precio min/max, capacidad select). Grid de RoomCards. Click → `/habitaciones/:id` |
| `RoomDetailPage.jsx` | `useParams()` → `roomAPI.getById(id)`. Galería de imágenes, info (number, type badge, price, capacity, description), servicios con iconos, calendario react-datepicker (rango), cálculo nights × price, botón "Reservar ahora" → `/reservar` con state |
| `LoginPage.jsx` | Formulario email + password. Validar vacíos. `authAPI.login()`. Guardar token. Redirigir según rol. Toast react-hot-toast |
| `RegisterPage.jsx` | Formulario name + email + password + confirmPassword. `authAPI.register()`. Guardar token. Redirigir. Link a login |

**Commit por página:** `feat: crear página pública [nombre]`

---

#### A16 — `client/src/pages/cliente/BookingConfirmPage.jsx`

**PÁGINA MÁS IMPORTANTE.** Recibe roomId, checkIn, checkOut por `location.state`.

Secciones:
1. Resumen habitación (imagen, number, type badge)
2. Fechas seleccionadas (check-in, check-out, noches)
3. Precio base (pricePerNight × nights)
4. Servicios adicionales (checkboxes con price, suman al total)
5. **Total a pagar** (en Bs., grande y destacado)
6. **Métodos de pago REALES** (NO simulación):
   - **QR Simple (BCB)**: radio button → `paymentAPI.generateQR({ bookingId })` → muestra QR. Texto: "Escanee este QR con la app de su banco."
   - **Tigo Money**: radio button → `paymentAPI.registerTigoMoney({ bookingId })` → muestra nro Tigo Money + monto. Texto: "Transfiera Bs. [monto] al [número]."
   - **Transferencia**: radio button → muestra datos bancarios. Botón subir comprobante → `paymentAPI.uploadComprobante(id, formData)`
   - **Efectivo**: radio button → "Puede pagar en efectivo en la recepción del hotel."
7. Botón "Confirmar Reserva" → `bookingAPI.create(data)` → toast éxito → redirect `/mis-reservas`

**Commit:** `feat: crear BookingConfirmPage con métodos de pago reales`

---

#### A17 — `client/src/pages/cliente/MyBookingsPage.jsx`

- `bookingAPI.getMyBookings()`
- Lista de BookingCards
- Botón Cancelar (si pendiente) → `bookingAPI.cancel(id)`
- Botón Calificar (si completada sin review) → modal con estrellas 1-5 + textarea → `bookingAPI.createReview(id, { rating, comment })`

**Commit:** `feat: crear MyBookingsPage con cancelar y calificar`

---

#### A18 — `client/src/pages/cliente/ProfilePage.jsx`

- `authAPI.getMe()`
- Mostrar name, email, phone, role badge
- Botón editar → formulario name + phone
- Botón cambiar contraseña → modal (actual, nueva, confirmar)
- Toast éxito/error

**Commit:** `feat: crear ProfilePage`

---

#### A19 — `client/src/pages/empleado/CleaningPanelPage.jsx`

- `cleaningAPI.getMyTasks()`
- Lista de tareas: habitación number, tipo, status badge
- Pendiente → botón verde "Iniciar limpieza" → `cleaningAPI.start(id)`
- En progreso → botón azul "Completar limpieza" → `cleaningAPI.complete(id)`
- Completada → texto gris "Completada"
- Toast al completar

**Commit:** `feat: crear CleaningPanelPage para empleados`

---

<a id="-erick--frontend-parte-2"></a>
## 🟩 ERICK — Frontend Parte 2

> **Prerrequisito:** Haber terminado TODOS los fixes de backend (C1-C9 + M1-M6) y que la rama `feature/erick-backend-fixes` haya sido mergeada a main. Hacer `git pull origin main` y luego crear nueva rama.  
> **Objetivo:** Crear las 7 páginas admin + App.jsx con todas las rutas.  
> **Duración estimada:** 3-4 días  
> **🌿 Rama:** `feature/erick-admin-frontend`

### Prerrequisito

```bash
# Después de que el líder haya mergeado feature/erick-backend-fixes a main:
git checkout main
git pull origin main
git checkout -b feature/erick-admin-frontend
```  

### Archivos que Erick crea

| # | Archivo | Descripción |
|---|---|---|
| E1 | `client/src/pages/admin/DashboardPage.jsx` | 4 cards métricas + 3 gráficos Recharts |
| E2 | `client/src/pages/admin/AdminRoomsPage.jsx` | Tabla CRUD habitaciones con modales |
| E3 | `client/src/pages/admin/AdminUsersPage.jsx` | Tabla CRUD usuarios con selector rol |
| E4 | `client/src/pages/admin/AdminServicesPage.jsx` | Tabla CRUD servicios |
| E5 | `client/src/pages/admin/AdminBookingsPage.jsx` | Tabla reservas con filtros y cambio estado |
| E6 | `client/src/pages/admin/AdminCleaningPage.jsx` | Tabla tareas limpieza, botón asignar |
| E7 | `client/src/pages/admin/AdminPaymentsPage.jsx` | Tabla pagos, botón verificar |

---

### Instrucciones detalladas

---

#### E1 — `client/src/pages/admin/DashboardPage.jsx`

- 4 cards superiores: Ocupación (%), Ingresos del mes (Bs.), Reservas activas, Calificación promedio (★)
- Fetch con `dashboardAPI.getSummary()`
- 3 gráficos con Recharts:
  - **Dona:** Ocupación por tipo → `dashboardAPI.getOccupancy()`
  - **Barras:** Ingresos mensuales → `dashboardAPI.getRevenue()`
  - **Barras horizontal:** Top 5 habitaciones → `dashboardAPI.getTopRooms()`

**Commit:** `feat: crear DashboardPage con métricas y gráficos`

---

#### E2 — `client/src/pages/admin/AdminRoomsPage.jsx`

- `roomAPI.getAll()` + `serviceAPI.getAll()`
- Tabla: Número, Tipo badge, Precio, Capacidad, Estado badge, Acciones
- Botón "Añadir" → modal (number, type select, pricePerNight, capacity, description, services checkboxes)
- Botón editar → modal pre-llenado
- Botón eliminar → confirmación
- Cambiar estado → select

**Commit:** `feat: crear AdminRoomsPage con CRUD`

---

#### E3 — `client/src/pages/admin/AdminUsersPage.jsx`

- `userAPI.getAll()`
- Tabla: Nombre, Email, Rol badge, Teléfono, Acciones
- Botón "Crear usuario" → modal (name, email, password, role select, phone)
- Botón eliminar → confirmación
- No permite eliminarse a sí mismo

**Commit:** `feat: crear AdminUsersPage con CRUD`

---

#### E4 — `client/src/pages/admin/AdminServicesPage.jsx`

- `serviceAPI.getAll()`
- Tabla: Icono, Nombre, Descripción, Precio (Bs.), Acciones
- Botón "Añadir" → modal (name, description, price, icon)
- Botón editar → modal pre-llenado
- Botón eliminar → confirmación

**Commit:** `feat: crear AdminServicesPage con CRUD`

---

#### E5 — `client/src/pages/admin/AdminBookingsPage.jsx`

- `bookingAPI.getAll()`
- Tabla: Cliente, Habitación, Check-in, Check-out, Total (Bs.), Estado badge, Acciones
- Filtro por estado (select)
- Cambiar estado → select en la fila

**Commit:** `feat: crear AdminBookingsPage con filtros`

---

#### E6 — `client/src/pages/admin/AdminCleaningPage.jsx`

- `cleaningAPI.getAll()` + `userAPI.getAll({ role: 'empleado' })`
- Tabla: Habitación, Empleado, Estado badge, Inicio, Fin, Duración
- Botón "Asignar tarea" → modal: select habitación (solo sucias), select empleado
- Card: tiempo promedio de limpieza

**Commit:** `feat: crear AdminCleaningPage con asignación de tareas`

---

#### E7 — `client/src/pages/admin/AdminPaymentsPage.jsx`

- `paymentAPI.getAll()`
- Tabla: ID Reserva, Cliente, Método badge, Monto (Bs.), Estado badge, Fecha
- Filtros por método y estado
- Botón "Verificar pago" (si pendiente) → modal con detalle según método → `paymentAPI.verify(id)` → toast éxito

**Commit:** `feat: crear AdminPaymentsPage con verificación de pagos`

---

<a id="-archivo-final-appjsx"></a>
## 🔧 ARCHIVO FINAL: App.jsx

> **Este archivo se crea AL FINAL, cuando AMBOS hayan terminado.**  
> **Lo crea el que termine último o lo acuerdan entre ambos.**

### `client/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';

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
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
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
                        <Route path="/admin/pagos" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminPaymentsPage />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

**Commit:** `feat: crear App.jsx con todas las rutas`

---

<a id="-flujo-de-trabajo"></a>
## 🔄 FLUJO DE TRABAJO

```
╔═══════════════════════════════════════════════════════════════════════╗
║                         TRABAJO EN PARALELO                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  ERICK 🌿 feature/erick-backend-fixes    ALEJANDRO 🌿 feature/alejandro-frontend   ║
║  ─────                                    ─────────                                   ║
║  Día 1-3:                                Día 1-5:                                    ║
║  C1 → C2 → C3/C4/C5                     A0a → A0b → A0c → A0d → A0e → A0f          ║
║  → C6/C7/C8 → C9                        → A1 → A2 → A3-A7                           ║
║  → M1 → M2 → M5 → M6                   → A8-A10 → A11-A15                           ║
║                                           → A16 → A17 → A18 → A19                     ║
║  push a su rama al terminar cada fix      push a su rama al terminar cada archivo     ║
║  → PR → líder mergea a main              → PR → líder mergea a main                  ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║                         TRABAJO SECUENCIAL                            ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  ERICK 🌿 feature/erick-admin-frontend (después de backend mergeado): ║
║  Día 4-7:                                                             ║
║  git pull origin main → git checkout -b feature/erick-admin-frontend  ║
║  E1 → E2 → E3 → E4 → E5 → E6 → E7                                   ║
║  push → PR → líder mergea a main                                      ║
║                                                                       ║
║  AMBOS (cuando terminen):                                             ║
║  Acordar quién crea App.jsx y hacer test final                         ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Secuencia paso a paso con ramas

| Paso | Erick | Alejandro | Nota |
|---|---|---|---|
| 0 | `git checkout -b feature/erick-backend-fixes` | `git checkout -b feature/alejandro-frontend` | Cada uno en su rama |
| 1 | C1, C2, C3/C4/C5, C6/C7/C8, C9, M1, M2, M5, M6 | A0a-A0f, A1, A2 | **En paralelo, cada uno en su rama** |
| 2 | Push a su rama → Crear PR | Push a su rama → Crear PR | Líder revisa y mergea |
| 3 | Espera a que líder mergee backend | Continúa A3-A10 (componentes) | Alejandro no espera backend |
| 4 | `git checkout main && git pull && git checkout -b feature/erick-admin-frontend` | A11-A19 (páginas cliente/empleado) | Erick empieza admin pages |
| 5 | E1-E7 (admin pages) | Push final | **En paralelo** |
| 6 | Push → PR → líder mergea | — | Ambos terminaron |
| 7 | **Acordar quién crea App.jsx** | — | El que termine primero |
| 8 | `git pull origin main` + test final | `git pull origin main` + test final | Verificar todo funciona |

### Reglas de coordinación

| # | Regla |
|---|---|
| 1 | **Cada integrante trabaja en SU rama.** Nunca directamente en `main`. |
| 2 | **Para integrar cambios:** push a su rama → crear Pull Request → líder revisa → líder mergea a main. |
| 3 | **Alejandro pushea A1 (api.js) y A2 (AuthContext) primero.** Erick necesita estos para las páginas admin. |
| 4 | **Después de cada merge a main, ambos hacen `git pull origin main` y `git merge origin/main` en su rama.** |
| 5 | **1 archivo = 1 commit.** Mensajes descriptivos. |
| 6 | **Si hay conflicto:** Comunicar por el grupo inmediatamente. |
| 7 | **No tocar archivos del otro sin pedir permiso.** |

---

### Dependencias de archivos

```
ALEJANDRO A0-A0f (correcciones)    ← INDEPENDIENTE, empezar AHORA
ALEJANDRO A1 (api.js)              ← INDEPENDIENTE (no necesita backend arreglado)
ALEJANDRO A2 (AuthContext)          ← NECESITA A1
ALEJANDRO A3-A10 (componentes)     ← NECESITA A2
ALEJANDRO A11-A15 (públicas)       ← NECESITA A3-A10
ALEJANDRO A16-A19 (cliente/emp)    ← NECESITA A3-A10, USA A1 (api.js)

ERICK C1-C9 (backend fixes)        ← INDEPENDIENTE, empezar AHORA
ERICK E1-E7 (admin pages)          ← NECESITA A1 + A2 (api.js + AuthContext) + backend arreglado
```

> **Importante:** Alejandro puede empezar TODO inmediatamente. Erick puede empezar los fixes de backend inmediatamente. Cuando Erick termine el backend y necesite hacer las páginas admin, Alejandro ya habrá pusheado api.js y AuthContext, así que Erick solo hace `git pull origin main` en su nueva rama y empieza.

---

<a id="-checklist-final"></a>
## ✅ CHECKLIST FINAL

Cuando ambos hayan terminado y el líder haya mergeado ambas ramas a main:

```bash
# 1. Traer todo lo mergeado
git checkout main
git pull origin main

# 2. Instalar todo
npm run install-all

# 3. Levantar servidor y cliente
npm run dev
# Debe mostrar: server en 5000, client en 5173

# 4. Flujo completo cliente
# - Registro → Login → Ver habitaciones → Filtrar → Ver detalle
# - Seleccionar fechas → Elegir servicios → Elegir pago QR
# - Confirmar reserva → Ver en "Mis Reservas" → Cancelar

# 5. Flujo empleado
# - Login empleado → Ver tareas → Iniciar limpieza → Completar

# 6. Flujo admin
# - Login admin → Dashboard (ver métricas y gráficos)
# - CRUD habitaciones → CRUD usuarios → CRUD servicios
# - Ver reservas → Cambiar estado → Asignar limpieza
# - Verificar pagos (QR, Tigo Money, Transferencia, Efectivo)

# 7. Verificar que gráficos cargan datos reales

# 8. Verificar que no hay errores en consola del navegador

# 9. Último commit y push
git add .
git commit -m "feat: entrega final - frontend completo"
git push origin main
```

### Flujo de Pull Requests

| Integrante | Rama | Qué contiene | Cuándo crear PR |
|---|---|---|---|
| Erick | `feature/erick-backend-fixes` | C1-C9 + M1-M6 (bugs corregidos) | Después de probar todos los endpoints |
| Alejandro | `feature/alejandro-frontend` | A0-A19 (infraestructura + componentes + páginas) | Después de probar navegación con mock data |
| Erick | `feature/erick-admin-frontend` | E1-E7 (páginas admin) | Después de probar las 7 páginas admin |
| Ambos | — | App.jsx con rutas finales | Como último commit en main |