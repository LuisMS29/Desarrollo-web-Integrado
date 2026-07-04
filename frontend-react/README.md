# Intranet Escolar — Frontend (React + Bootstrap)

Frontend que consume el backend Spring Boot (`backend.zip`) del proyecto
"Intranet Escolar". Incluye login para los 4 roles (ADMIN, DIRECTOR,
DOCENTE, ESTUDIANTE) y el módulo completo de **Administración**.

## 1. Requisitos previos

- Node.js 18+ y npm
- El backend corriendo en `http://localhost:8080` (Spring Boot + MySQL)
- Base de datos `db_intranet_escolar` importada y corriendo en MySQL

## 2. ⚠️ Paso obligatorio en el backend: CORS

El backend, tal como venía configurado, **solo permite peticiones desde
`http://localhost:4200`** (pensado para Angular). Este frontend usa Vite,
que corre en el puerto **5173**, así que hay que habilitarlo.

Abre `SecurityConfig.java` en tu backend
(`src/main/java/com/colegio/intranet/config/SecurityConfig.java`) y
reemplaza esta línea:

```java
configuration.setAllowedOrigins(List.of("http://localhost:4200"));
```

por:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:4200",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
));
```

Luego reinicia el backend.

## 3. Instalar y correr el frontend

```bash
cd frontend
npm install
npm run dev
```

Se abrirá en **http://localhost:5173**.

Si tu backend corre en otra URL/puerto, cámbialo en:
`src/api/axiosClient.js` → constante `API_BASE_URL`.

## 4. Usuarios de prueba (vienen en el .sql de ejemplo)

| Usuario      | Rol       |
|--------------|-----------|
| admin        | ADMIN     |
| director     | DIRECTOR  |
| juanperez    | DOCENTE   |
| marialopez   | DOCENTE   |

La contraseña es la que corresponda al hash ya guardado en tu base de
datos (defínela tú mismo si vas a reimportar el `.sql`).

Estudiantes: aún no hay usuarios con rol ESTUDIANTE en el seed — puedes
crear uno desde **Admin → Usuarios → Nuevo usuario** eligiendo rol
`ESTUDIANTE`.

## 5. Qué incluye esta primera entrega

- **Login único** para los 4 roles: autentica contra `/api/auth/login` y
  redirige automáticamente al panel correspondiente según el `rol` que
  devuelve el backend.
- **Rutas protegidas por rol** (`ProtectedRoute`): si un DOCENTE intenta
  entrar a `/admin`, se le redirige a "No autorizado".
- **Sesión persistente**: el token se guarda en `localStorage` y se
  reenvía automáticamente en cada petición (`Authorization: Bearer ...`).
  Si el token vence (401), se cierra la sesión y se vuelve al login.
- **Manejo de errores centralizado**: todo error de red o de backend se
  traduce a un mensaje legible (toast / alerta), nunca queda una pantalla
  en blanco o un error de consola silencioso.
- **Panel de Administración completo**:
  - Dashboard con indicadores (usuarios, docentes, estudiantes, cursos, comunicados).
  - **Usuarios**: crear (con selector de rol), activar/desactivar, eliminar, buscar y filtrar por rol.
  - **Docentes, Estudiantes**: alta, edición, eliminación.
  - **Grados, Secciones, Asignaturas, Períodos académicos**: catálogos base.
  - **Cursos**: asocia asignatura + grado + sección + período + docente.
  - **Comunicados**: publicación de avisos dirigidos a un rol o a todos.
- **Paneles base para DIRECTOR, DOCENTE y ESTUDIANTE**: ya tienen login,
  layout y control de acceso funcionando; listos para que la siguiente
  etapa agregue sus funcionalidades específicas (notas, asistencia, etc.)

## 6. Estructura del proyecto

```
src/
  api/            clientes HTTP (axios) por recurso
  context/        AuthContext (sesión) y ToastContext (notificaciones)
  components/     piezas reutilizables (tabla CRUD genérica, modales, etc.)
  layouts/        layout del panel Admin y layout simple para otros roles
  pages/
    auth/         Login, No autorizado
    admin/        todas las pantallas del panel de Administración
    dashboards/   placeholders de Director/Docente/Estudiante
  styles/         tokens de diseño + Bootstrap
```

## 7. Notas técnicas

- El backend expone `Curso.docente`, `Curso.grado`, etc. como objetos
  anidados; al crear/editar un Curso desde el frontend solo se envía el
  `id` de cada relación (`{ idGrado: 3 }`), que es lo que Spring Data JPA
  necesita para enlazar la fila.
- Los endpoints de eliminación (`/admin/...`) solo están habilitados para
  el rol ADMIN en el backend — coherente con lo que este frontend expone.
