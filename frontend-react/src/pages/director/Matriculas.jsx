import EntityCrudPage from "../../components/EntityCrudPage";
import { matriculasConfig } from "../shared/catalogConfigs";

export default function Matriculas() {
  return <EntityCrudPage {...matriculasConfig} canDelete={false} />;
}
