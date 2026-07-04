import EntityCrudPage from "../../components/EntityCrudPage";
import { comunicadosConfig } from "../shared/catalogConfigs";

export default function Comunicados() {
  return <EntityCrudPage {...comunicadosConfig()} canDelete={false} />;
}