# 🏫 Intranet Escolar

Sistema de gestión académica integral para instituciones educativas de nivel primaria. Plataforma web con roles diferenciados (**Administrador**, **Director**, **Docente**, **Estudiante**) que centraliza matrículas, notas, asistencia, horarios, comunicados y notificaciones.

---

## 🚀 Tecnologías

### Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| Java | 17 | Lenguaje base |
| Spring Boot | 3.2.5 | Framework REST |
| Spring Security + JWT (jjwt 0.12.3) | — | Autenticación y autorización |
| Spring Data JPA / Hibernate | — | ORM y persistencia |
| MySQL 8 | — | Base de datos relacional |
| Maven | — | Build y dependencias |
| Lombok | — | Reducción de boilerplate |
| Bean Validation (@Valid) | — | Validación de datos en DTOs |
| Chart.js | 4.x | Gráficos en dashboards (frontend) |

### Frontend

| Tecnología | Versión |
|---|---|
| Angular | 22.0.0 |
| TypeScript | ~6.0.2 |
| RxJS | ~7.8.0 |
| Bootstrap 5 | ^5.3.8 (solo CSS, sin JS) |
| Bootstrap Icons | ^1.11.3 |
| Angular CLI | ^22.0.5 |
| Vitest | ^4.0.8 (tests unitarios) |

---

## 📁 Estructura del proyecto

```
Desarrollo-web-Integrado/
├── backend/                              # Spring Boot REST API (puerto 8080)
│   ├── pom.xml
│   └── src/main/java/com/colegio/intranet/
│       ├── config/             # SecurityConfig, JwtAuthFilter, ApplicationConfig, JacksonConfig, WebConfig
│       ├── controller/         # 17 REST controllers
│       ├── dto/                # 9 DTOs
│       ├── entity/             # 16 JPA entities (incl. ComunicadoLeido)
│       ├── exception/          # GlobalExceptionHandler
│       ├── repository/         # 16 Spring Data JPA repositories
│       └── service/            # AuthenticationService, JwtService, NotificacionService
├── frontend/                             # Angular SPA (puerto 4200)
│   ├── angular.json
│   ├── package.json
│   ├── public/
│   │   └── salon.avif
│   └── src/app/
│       ├── core/               # Guards, interceptors, services
│       ├── layouts/            # 4 layouts (admin, director, docente, estudiante)
│       ├── pages/
│       │   ├── auth/           # Login
│       │   ├── admin/          # Dashboard, usuarios, docentes, estudiantes, catálogos
│       │   ├── director/       # Dashboard, CRUDs completos, horarios, matrículas
│       │   ├── docente/        # Dashboard, cursos, notas, asistencia, horario
│       │   ├── estudiante/     # Dashboard, cursos, notas, asistencia, horario
│       │   └── onboarding/     # Completar perfil
│       └── shared/             # EntityCrudPage, Sidebar, ConfirmModal, etc.
├── database/
│   └── db_intranet_escolar.sql
└── postman/
    └── Intranet-Escolar-API.postman_collection.json
```

---

## 🗄️ Base de datos — 16 tablas

### Tablas del sistema
| Tabla | Descripción |
|---|---|
| usuario | Usuarios del sistema (login, roles: ADMIN/DIRECTOR/DOCENTE/ESTUDIANTE) |
| estudiante | Fichas de estudiantes, vinculadas a usuario |
| docente | Fichas de docentes, vinculadas a usuario |

### Tablas académicas
| Tabla | Descripción |
|---|---|
| grado | Grados (1° a 6° de primaria) con orden personalizable |
| seccion | Secciones (A, B, etc.) |
| periodo_academico | Años escolares con flag activo |
| asignatura | Cursos/materias |
| curso | Combinación asignatura + grado + sección + periodo + docente |
| matricula | Inscripción de estudiante en un curso |
| evaluacion_periodo | Bimestres/trimestres dentro de un periodo académico |

### Tablas de seguimiento
| Tabla | Descripción |
|---|---|
| nota | Calificaciones (0–20) por matrícula y evaluación |
| asistencia | Registro diario (PRESENTE/AUSENTE/TARDANZA/JUSTIFICADO) |
| horario_curso | Horarios por curso (día, hora inicio/fin, aula) |

### Tablas de comunicación
| Tabla | Descripción |
|---|---|
| comunicado | Comunicados con filtro por rol destinatario (TODOS, DOCENTE, ESTUDIANTE, DIRECTOR, ADMIN, CURSO) |
| comunicado_leido | Control de lectura de comunicados por usuario |
| notificacion | Notificaciones internas con tipos (INFO, WARNING, SUCCESS, ERROR) y referencia a entidad |

---

## 🌐 API REST — Todos los endpoints

Base URL: http://localhost:8080/api/

### 🔐 Autenticación (/auth)
| Método | Ruta | Público | Descripción |
|---|---|---|---|
| POST | /auth/login | ✅ | Login (JWT + perfilCompleto, idPerfil, fotoUrl) |
| POST | /auth/register | ✅ | Registrar usuario (crea ficha docente/estudiante) |
| GET | /auth/profile | ❌ | Perfil del usuario autenticado |
| PUT | /auth/profile | ❌ | Actualizar email del perfil |
| POST | /auth/foto | ❌ | Subir foto de perfil (multipart) |
| DELETE | /auth/foto | ❌ | Eliminar foto de perfil |
| PUT | /auth/password | ❌ | Cambiar contraseña |
| GET | /auth/test | ✅ | Endpoint de prueba |

### 👥 Admin usuarios (/admin/usuarios) — Solo ADMIN
| Método | Ruta | Descripción |
|---|---|---|
| GET | /admin/usuarios | Listar todos |
| GET | /admin/usuarios/{id} | Obtener por ID |
| PUT | /admin/usuarios/{id} | Actualizar |
| PUT | /admin/usuarios/{id}/activar | Activar |
| PUT | /admin/usuarios/{id}/desactivar | Desactivar |
| DELETE | /admin/usuarios/{id} | Eliminar |
| POST | /admin/usuarios/{id}/foto | Subir foto |
| DELETE | /admin/usuarios/{id}/foto | Eliminar foto |

### 👨‍🏫 Panel Docente
| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | /docente/me | DOCENTE | Ficha propia (creación automática) |
| PUT | /docente/me | DOCENTE | Actualizar perfil (onboarding) |
| GET | /docente/{id}/cursos | ADMIN,DIRECTOR,DOCENTE | Cursos asignados |

### 👨‍🎓 Panel Estudiante
| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | /estudiante/me | ESTUDIANTE | Ficha propia (creación automática) |
| PUT | /estudiante/me | ESTUDIANTE | Actualizar perfil (onboarding) |
| GET | /estudiante/{id}/matriculas | Todos | Matrículas del estudiante |

### 📚 CRUD Catálogos (Director / Admin)
Patrón: GET /{entidad}/listar, GET /{entidad}/{id}, POST /director/{entidad}s, PUT /director/{entidad}s/{id}, DELETE /admin/{entidad}s/{id}

Entidades: grado, seccion, asignatura, periodo (+ GET /periodo/activo), evaluacion (+ GET /periodo/{id}/evaluaciones), horario (+ GET /curso/{id}/horarios), matricula (+ GET /curso/{id}/matriculas, GET /estudiante/{id}/matriculas)

### 📖 Cursos
GET /curso/listar, GET /curso/activos, GET /curso/{id}, POST /director/cursos, PUT /director/cursos/{id}, DELETE /admin/cursos/{id} (valida matrículas)

### 📝 Notas
POST /docente/notas (notifica estudiante), PUT /docente/notas/{id}, GET /estudiante/{matriculaId}/notas, DELETE /admin/notas/{id}

### 📋 Asistencia
POST /docente/asistencias, PUT /docente/asistencias/{id}, GET /estudiante/{matriculaId}/asistencias, DELETE /admin/asistencias/{id}

### 📢 Comunicados
GET /comunicado/listar, GET /comunicado/{id}, GET /comunicado/publicos (público)
POST/DELETE por rol (admin/director/docente), GET /docente/comunicados/mios
POST /comunicados/{id}/leer, GET /comunicados/leidos

### 🔔 Notificaciones
GET /usuario/{id}/notificaciones, GET /usuario/{id}/notificaciones/no-leidas
POST /notificaciones, PUT /notificaciones/{id}/leer, DELETE /notificaciones/{id}

### 🖼️ Fotos
GET /api/uploads/{dir}/{filename} — Sirve archivos (JPG, PNG, GIF, WebP, SVG)

---

## ✨ Funcionalidades por rol

### 👑 ADMIN
- Dashboard con gráfico doughnut (Chart.js) de distribución de roles
- CRUD de usuarios (activar/desactivar/eliminar con gestión de fotos)
- Gestión completa de catálogos

### 🎯 DIRECTOR
- Dashboard con resumen y periodo activo
- CRUD de docentes y estudiantes (códigos automáticos DOC/EST)
- Gestión de cursos, matrículas (notifica al estudiante), horarios, evaluaciones
- Comunicados dirigidos por rol (TODOS, DOCENTE, ESTUDIANTE, CURSO)

### 👨‍🏫 DOCENTE
- Dashboard con métricas de cursos y distribución de estudiantes
- Registro de notas (0–20) y asistencia (Presente/Tardanza/Ausente/Justificado)
- Notificaciones automáticas al estudiante al registrar notas/asistencia
- Mis horarios, mis estudiantes, comunicados propios

### 👨‍🎓 ESTUDIANTE
- Dashboard con métricas de cursos/materias/grados
- Mis notas, mi asistencia, mi horario, mis cursos
- Bandeja de comunicados institucionales

### 🔄 Transversales
- **Onboarding**: Docentes y estudiantes completan su perfil después del primer login (redirección automática)
- **Notificaciones**: Bandeja con polling cada 30s, panel deslizable, tipos (INFO, WARNING, SUCCESS, ERROR) y referencia a entidad
- **Buzón de comunicados**: Dropdown con comunicados recientes, control de lectura
- **Toast**: Notificaciones emergentes (éxito, error, advertencia, info) con auto-dismiss a los 4s
- **Sidebar responsive**: Navegación adaptada al rol, con secciones colapsables, diseño mobile-first
- **EntityCrudPage**: Componente genérico reutilizable para CRUD con búsqueda, ordenamiento, paginación y confirmación modal
- **Fotos de perfil**: Subida y eliminación con almacenamiento en servidor y previsualización

---

## 🔒 Seguridad

- **JWT** (JSON Web Token) con algoritmo HS256, expiración de 24 horas (86400000 ms)
- **BCrypt** para hash de contraseñas
- **Roles** con `@PreAuthorize` granular en cada endpoint
- **AuthGuard** en frontend que verifica:
  - Autenticación (token presente)
  - Rol permitido para la ruta
  - Perfil completo (redirige a onboarding si es necesario)
- **Interceptor HTTP** que adjunta el token Bearer a cada petición
- **Error interceptor** que captura errores HTTP (401, 403, 404, 500) y muestra mensajes amigables al usuario
- **CORS** configurado para `http://localhost:4200`, `http://localhost:5173`, `http://127.0.0.1:5173`
- **Protección contra path traversal** en el servidor de fotos
- **Sesiones stateless** (sin estado)

---

## 📦 Instalación y ejecución

### Requisitos
- Java 17+ (JDK)
- Maven 3.8+
- Node.js 22+ (npm 11+)
- MySQL 8+

### 1. Base de datos
```bash
mysql -u root -p < database/db_intranet_escolar.sql
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn clean install -q
mvn spring-boot:run
# http://localhost:8080
```

### 3. Frontend (Angular)
```bash
cd frontend
npm install
npm start
# http://localhost:4200
```

---

## 👤 Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `123456` | ADMIN |
| `director` | `123456` | DIRECTOR |
| `jperez` | `123456` | DOCENTE |
| `mlopez` | `123456` | DOCENTE |
| `cgarcia` | `123456` | DOCENTE |
| `atorres` | `123456` | DOCENTE |
| `jcastillo` | `123456` | ESTUDIANTE |
| `mvelarde` | `123456` | ESTUDIANTE |
| `drojas` | `123456` | ESTUDIANTE |
| `cquispe` | `123456` | ESTUDIANTE |
| `fhuaman` | `123456` | ESTUDIANTE |
| `gparedes` | `123456` | ESTUDIANTE |
| `squinteros` | `123456` | ESTUDIANTE |

---

## ⚙️ Configuración

### Backend (`application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db_intranet_escolar?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=********
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
security.jwt.expiration-time=86400000
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=uploads/fotos
```

### Frontend (`api.service.ts`)
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 📐 Arquitectura del frontend

### Módulos (lazy loading)

| Módulo | Ruta base | Descripción |
|---|---|---|
| `AuthModule` | `/login` | Autenticación |
| `AdminModule` | `/admin` | Panel de administración (11 páginas) |
| `DirectorModule` | `/director` | Panel de dirección (13 páginas) |
| `DocenteModule` | `/docente` | Panel del docente (8 páginas) |
| `EstudianteModule` | `/estudiante` | Panel del estudiante (7 páginas) |
| `OnboardingModule` | `/docente/completar-perfil`, `/estudiante/completar-perfil` | Compleción de perfil |
| `SharedModule` | — | Componentes compartidos (10 componentes + 1 pipe) |

### Componentes compartidos

| Componente | Descripción |
|---|---|
| `EntityCrudPage` | CRUD genérico reutilizable con tabla, búsqueda, ordenamiento, paginación y modal de confirmación |
| `Sidebar` | Barra lateral responsiva con secciones colapsables por rol |
| `ConfirmModal` | Modal de confirmación reutilizable |
| `LoadingState` | Estado de carga animado |
| `ErrorState` | Estado de error con mensaje y acción de reintento |
| `NotificacionesDropdown` | Dropdown de notificaciones en la barra superior |
| `NotificacionesPanel` | Panel deslizable lateral de notificaciones |
| `BuzonDropdown` | Dropdown de comunicados recientes |
| `ComunicadosFeed` | Feed de comunicados |
| `SafeHtmlPipe` | Pipe para sanitizar HTML |
