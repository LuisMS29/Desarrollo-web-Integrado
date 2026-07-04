import EntityCrudPage from "../../components/EntityCrudPage";
import { docentesConfig } from "../shared/catalogConfigs";

// El Director puede crear y editar docentes, pero no eliminarlos
// (esa acción queda reservada para el rol ADMIN en el backend).
export default function Docentes() {
  return <EntityCrudPage {...docentesConfig} canDelete={false} canCreate={false} />;
}
