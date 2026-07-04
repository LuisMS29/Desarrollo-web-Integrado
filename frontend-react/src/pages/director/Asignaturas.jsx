import EntityCrudPage from "../../components/EntityCrudPage";
import { asignaturasConfig } from "../shared/catalogConfigs";

export default function Asignaturas() {
  return <EntityCrudPage {...asignaturasConfig} canDelete={false} />;
}
