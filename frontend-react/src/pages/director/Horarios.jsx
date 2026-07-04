import EntityCrudPage from "../../components/EntityCrudPage";
import { horariosConfig } from "../shared/catalogConfigs";

export default function Horarios() {
  return <EntityCrudPage {...horariosConfig} canDelete={false} />;
}
