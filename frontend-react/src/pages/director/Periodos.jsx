import EntityCrudPage from "../../components/EntityCrudPage";
import { periodosConfig } from "../shared/catalogConfigs";

export default function Periodos() {
  return <EntityCrudPage {...periodosConfig} canDelete={false} />;
}
