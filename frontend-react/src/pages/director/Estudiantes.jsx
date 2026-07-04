import EntityCrudPage from "../../components/EntityCrudPage";
import { estudiantesConfig } from "../shared/catalogConfigs";

export default function Estudiantes() {
  return <EntityCrudPage {...estudiantesConfig} canDelete={false} canCreate={false} />;
}
