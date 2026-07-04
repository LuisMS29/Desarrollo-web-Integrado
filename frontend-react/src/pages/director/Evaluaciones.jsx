import EntityCrudPage from "../../components/EntityCrudPage";
import { evaluacionesConfig } from "../shared/catalogConfigs";

export default function Evaluaciones() {
  return <EntityCrudPage {...evaluacionesConfig} canDelete={false} />;
}
