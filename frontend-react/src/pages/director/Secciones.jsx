import EntityCrudPage from "../../components/EntityCrudPage";
import { seccionesConfig } from "../shared/catalogConfigs";

export default function Secciones() {
  return <EntityCrudPage {...seccionesConfig} canDelete={false} />;
}
