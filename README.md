# Intranet Escolar

Sistema de gestión académica integral para instituciones educativas de nivel primaria. Plataforma web con roles diferenciados (Administrador, Director, Docente, Estudiante) que centraliza matrículas, notas, asistencia, horarios y comunicados.

---

## Tecnologías

### Backend
| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Security + JWT (jjwt 0.12.3) | Autenticación y autorización |
| Spring Data JPA / Hibernate | ORM |
| MySQL 8 | Base de datos |
| Maven | Build |
| Lombok | Reducción de boilerplate |
| Bean Validation (`@Valid`) | Validación de datos |

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

## Estructura del proyecto

```
Desarrollo-web-Integrado/
├── backend/                          # Spring Boot REST API (port 8080)
│   ├── pom.xml
│   └── src/main/java/com/colegio/intranet/
│       ├── config/       # SecurityConfig, JwtAuthFilter, ApplicationConfig, JacksonConfig
│       ├── controller/   # 16 REST controllers
│       ├── dto/          # LoginRequest, RegisterRequest, LoginResponse, MessageResponse, etc.
│       ├── entity/       # 15 JPA entities
│       ├── exception/    # GlobalExceptionHandler
│       ├── repository/   # 15 Spring Data JPA repositories
│       └── service/      # AuthenticationService, JwtService
├── frontend/                         # Angular SPA (port 4200)
│   ├── angular.json
│   ├── package.json
│   └── src/app/
│       ├── core/          # Guards, interceptors, services (AuthService, ApiService, ToastService)
│       ├── layouts/       # 4 layouts (admin, director, docente, estudiante)
│       ├── pages/
│       │   ├── auth/         # Login
│       │   ├── admin/        # Dashboard, Usuarios CRUD
│       │   ├── director/     # Dashboard, CRUDs (docentes, estudiantes, cursos, comunicados)
│       │   ├── docente/      # Dashboard, Mis Cursos, Mis Estudiantes
│       │   ├── estudiante/   # Dashboard, Mis Cursos, Mis Notas
│       │   └── onboarding/   # Completar perfil (docente/estudiante)
│       └── shared/        # EntityCrudPage, Sidebar, ConfirmModal, LoadingState, ErrorState,
│                           # NotificacionesDropdown, ComunicadosFeed
├── database/
│   └── db_intranet_escolar.sql   # Schema + data de prueba
└── postman/
    └── Intranet-Escolar-API.postman_collection.json
```

---

## Base de datos — 15 tablas

| Tabla | Descripción |
|---|---|
| `usuario` | Usuarios del sistema (login, roles: ADMIN/DIRECTOR/DOCENTE/ESTUDIANTE) |
| `estudiante` | Fichas de estudiantes, vinculadas a `usuario` |
| `docente` | Fichas de docentes, vinculadas a `usuario` |
| `grado` | Grados (1° a 6° de primaria) |
| `seccion` | Secciones (A, B) |
| `periodo_academico` | Años escolares |
| `asignatura` | Cursos/materias |
| `curso` | Combinación asignatura + grado + sección + periodo + docente |
| `matricula` | Inscripción de estudiante en un curso |
| `evaluacion_periodo` | Bimestres/trimestre dentro de un periodo |
| `nota` | Calificaciones (0–20) por matrícula y evaluación |
| `asistencia` | Registro diario de asistencia (PRESENTE/AUSENTE/TARDANZA/JUSTIFICADO) |
| `horario_curso` | Horarios por curso (día, hora inicio/fin, aula) |
| `notificacion` | Notificaciones internas entre usuarios |
| `comunicado` | Comunicados/avisos con filtro por rol destinatario |

---

## API REST — Endpoints principales

Todos bajo `http://localhost:8080/api/`.

### Autenticación (`/auth`)
| Método | Ruta | Público | Descripción |
|---|---|---|---|
| POST | `/auth/login` | Sí | Login (devuelve JWT + datos del usuario) |
| POST | `/auth/register` | Sí | Registrar nuevo usuario |
| GET | `/auth/profile` | No | Perfil del usuario autenticado |

### CRUD genérico (Administrador / Director)
Cada entidad expone: `GET /listar`, `GET /{id}`, `POST /director/{entidad}`, `PUT /director/{entidad}/{id}`, `DELETE /admin/{entidad}/{id}`.

Entidades gestionadas: `grado`, `seccion`, `asignatura`, `curso`, `periodo`, `evaluacion`, `horario`, `matricula`, `docente`, `estudiante`, `comunicado`.

### Docente
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/docente/me` | Perfil propio |
| PUT | `/docente/me` | Actualizar perfil (onboarding) |
| GET | `/docente/{id}/cursos` | Cursos asignados |
| POST/PUT | `/docente/notas[/{id}]` | Registrar/actualizar notas |
| POST/PUT | `/docente/asistencias[/{id}]` | Registrar/actualizar asistencias |

### Estudiante
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/estudiante/me` | Perfil propio |
| PUT | `/estudiante/me` | Actualizar perfil (onboarding) |
| GET | `/estudiante/{id}/matriculas` | Matrículas del estudiante |

---

## Instalación y ejecución

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

## Usuarios de prueba

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

## Funcionalidades por rol

### ADMIN
- Dashboard con estadísticas generales
- CRUD de usuarios del sistema (activar/desactivar/eliminar)
- Gestión completa de catálogos (grados, secciones, asignaturas, periodos, etc.)

### DIRECTOR
- Dashboard con resumen de docentes, estudiantes, cursos, matrículas
- CRUD de docentes y estudiantes
- Gestión de cursos (asignatura + grado + sección + periodo + docente)
- Matrículas de estudiantes en cursos
- Horarios por curso
- Evaluaciones (bimestres)
- Comunicados dirigidos por rol

### DOCENTE
- Dashboard con perfil y lista de cursos asignados
- Registro de notas (0–20) por estudiante y evaluación
- Registro de asistencia diaria (Presente / Tardanza / Ausente / Justificado)
- Visualización de horarios
- Comunicados

### ESTUDIANTE
- Dashboard con perfil y resumen de cursos
- Visualización de notas y asistencia
- Visualización de horarios
- Comunicados

### Transversales
- **Onboarding**: Docentes y estudiantes completan su perfil después del primer login
- **Notificaciones**: Bandeja de notificaciones con polling cada 30s
- **Toast**: Notificaciones emergentes (éxito, error, advertencia, info)
- **Sidebar responsive**: Navegación adaptada al rol, con secciones colapsables
- **EntityCrudPage**: Componente genérico reutilizable para CRUD con búsqueda, ordenamiento y confirmación

---

## Seguridad

- **JWT** (JSON Web Token) con algoritmo HS256, expiración de 24 horas
- **BCrypt** para hash de contraseñas
- **Roles** con `@PreAuthorize` en los endpoints
- **AuthGuard** en frontend que verifica autenticación, rol y perfil completado
- **Interceptor** que adjunta el token Bearer a cada petición
- **Error interceptor** que captura errores HTTP y muestra mensajes al usuario
- **CORS** configurado para `http://localhost:4200`, `http://localhost:5173`

---

## Configuración

### Backend (`application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db_intranet_escolar
spring.datasource.username=root
spring.datasource.password=********
spring.jpa.hibernate.ddl-auto=none
jwt.secret=********
jwt.expiration=86400000
```

### Frontend (`api.service.ts`)
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

---