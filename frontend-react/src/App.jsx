import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";

import OnboardingEstudiante from "./pages/onboarding/OnboardingEstudiante";
import OnboardingDocente from "./pages/onboarding/OnboardingDocente";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Usuarios from "./pages/admin/Usuarios";
import AdminDocentes from "./pages/admin/Docentes";
import AdminEstudiantes from "./pages/admin/Estudiantes";
import AdminGrados from "./pages/admin/Grados";
import AdminSecciones from "./pages/admin/Secciones";
import AdminAsignaturas from "./pages/admin/Asignaturas";
import AdminCursos from "./pages/admin/Cursos";
import AdminPeriodos from "./pages/admin/Periodos";
import AdminComunicados from "./pages/admin/Comunicados";

import DirectorLayout from "./layouts/DirectorLayout";
import DirectorDashboard from "./pages/director/Dashboard";
import DirectorDocentes from "./pages/director/Docentes";
import DirectorEstudiantes from "./pages/director/Estudiantes";
import DirectorGrados from "./pages/director/Grados";
import DirectorSecciones from "./pages/director/Secciones";
import DirectorAsignaturas from "./pages/director/Asignaturas";
import DirectorCursos from "./pages/director/Cursos";
import DirectorHorarios from "./pages/director/Horarios";
import DirectorPeriodos from "./pages/director/Periodos";
import DirectorEvaluaciones from "./pages/director/Evaluaciones";
import DirectorMatriculas from "./pages/director/Matriculas";
import DirectorComunicados from "./pages/director/Comunicados";

import DocenteLayout from "./layouts/DocenteLayout";
import DocenteDashboard from "./pages/docente/Dashboard";
import DocenteMisCursos from "./pages/docente/MisCursos";
import DocenteMisEstudiantes from "./pages/docente/MisEstudiantes";
import DocenteNotas from "./pages/docente/Notas";
import DocenteAsistencia from "./pages/docente/Asistencia";
import DocenteMiHorario from "./pages/docente/MiHorario";
import DocenteComunicados from "./pages/docente/Comunicados";

import EstudianteLayout from "./layouts/EstudianteLayout";
import EstudianteDashboard from "./pages/estudiante/Dashboard";
import EstudianteMisCursos from "./pages/estudiante/MisCursos";
import EstudianteMisNotas from "./pages/estudiante/MisNotas";
import EstudianteMiHorario from "./pages/estudiante/MiHorario";
import EstudianteMiAsistencia from "./pages/estudiante/MiAsistencia";
import EstudianteComunicados from "./pages/estudiante/Comunicados";

const ROLE_HOME = {
  ADMIN: "/admin",
  DIRECTOR: "/director",
  DOCENTE: "/docente",
  ESTUDIANTE: "/estudiante",
};

const ONBOARDING = {
  DOCENTE: "/docente/completar-perfil",
  ESTUDIANTE: "/estudiante/completar-perfil",
};

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const onboardingPath = ONBOARDING[user.rol];
  if (user.perfilCompleto === false && onboardingPath) {
    return <Navigate to={onboardingPath} replace />;
  }
  return <Navigate to={ROLE_HOME[user.rol] || "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />


            {/* ONBOARDING (perfiles incompletos) */}
            <Route element={<ProtectedRoute allowedRoles={["ESTUDIANTE"]} ignorePerfil />}>
              <Route path="/estudiante/completar-perfil" element={<OnboardingEstudiante />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["DOCENTE"]} ignorePerfil />}>
              <Route path="/docente/completar-perfil" element={<OnboardingDocente />} />
            </Route>

            {/* ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="docentes" element={<AdminDocentes />} />
                <Route path="estudiantes" element={<AdminEstudiantes />} />
                <Route path="grados" element={<AdminGrados />} />
                <Route path="secciones" element={<AdminSecciones />} />
                <Route path="asignaturas" element={<AdminAsignaturas />} />
                <Route path="cursos" element={<AdminCursos />} />
                <Route path="periodos" element={<AdminPeriodos />} />
                <Route path="comunicados" element={<AdminComunicados />} />
              </Route>
            </Route>

            {/* DIRECTOR */}
            <Route element={<ProtectedRoute allowedRoles={["DIRECTOR"]} />}>
              <Route path="/director" element={<DirectorLayout />}>
                <Route index element={<DirectorDashboard />} />
                <Route path="docentes" element={<DirectorDocentes />} />
                <Route path="estudiantes" element={<DirectorEstudiantes />} />
                <Route path="grados" element={<DirectorGrados />} />
                <Route path="secciones" element={<DirectorSecciones />} />
                <Route path="asignaturas" element={<DirectorAsignaturas />} />
                <Route path="cursos" element={<DirectorCursos />} />
                <Route path="horarios" element={<DirectorHorarios />} />
                <Route path="periodos" element={<DirectorPeriodos />} />
                <Route path="evaluaciones" element={<DirectorEvaluaciones />} />
                <Route path="matriculas" element={<DirectorMatriculas />} />
                <Route path="comunicados" element={<DirectorComunicados />} />
              </Route>
            </Route>

            {/* DOCENTE */}
            <Route element={<ProtectedRoute allowedRoles={["DOCENTE"]} />}>
              <Route path="/docente" element={<DocenteLayout />}>
                <Route index element={<DocenteDashboard />} />
                <Route path="cursos" element={<DocenteMisCursos />} />
                <Route path="cursos/:cursoId/notas" element={<DocenteNotas />} />
                <Route path="cursos/:cursoId/asistencia" element={<DocenteAsistencia />} />
                <Route path="horario" element={<DocenteMiHorario />} />
                <Route path="estudiantes" element={<DocenteMisEstudiantes />} />
                <Route path="comunicados" element={<DocenteComunicados />} />
              </Route>
            </Route>

            {/* ESTUDIANTE */}
            <Route element={<ProtectedRoute allowedRoles={["ESTUDIANTE"]} />}>
              <Route path="/estudiante" element={<EstudianteLayout />}>
                <Route index element={<EstudianteDashboard />} />
                <Route path="cursos" element={<EstudianteMisCursos />} />
                <Route path="horario" element={<EstudianteMiHorario />} />
                <Route path="notas" element={<EstudianteMisNotas />} />
                <Route path="asistencia" element={<EstudianteMiAsistencia />} />
                <Route path="comunicados" element={<EstudianteComunicados />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
