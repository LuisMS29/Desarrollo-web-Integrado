import ComunicadosFeed from "../../components/ComunicadosFeed";

export default function Comunicados() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Comunicados</h1>
        <p className="text-secondary mb-0">Avisos institucionales dirigidos a todos o a estudiantes.</p>
      </div>
      <ComunicadosFeed rolActual="ESTUDIANTE" />
    </div>
  );
}
