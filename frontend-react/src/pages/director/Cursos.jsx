import EntityCrudPage from "../../components/EntityCrudPage";
import { cursosConfig } from "../shared/catalogConfigs";

export default function Cursos() {
  return <EntityCrudPage {...cursosConfig} canDelete={false} />;
}
