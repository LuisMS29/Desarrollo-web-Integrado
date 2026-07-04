import EntityCrudPage from "../../components/EntityCrudPage";
import { gradosConfig } from "../shared/catalogConfigs";

export default function Grados() {
  return <EntityCrudPage {...gradosConfig} canDelete={false} />;
}
