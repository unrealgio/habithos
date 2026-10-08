import { useEffect, useState } from "react";
import { APP_NAME } from "@habithos/shared";

type HealthResponse = {
  status: string;
  app: string;
};

function App() {
  const [apiStatus, setApiStatus] = useState("Conectando à API...");

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`);
        }

        const data: HealthResponse = await response.json();
        setApiStatus(`API ${data.app}: ${data.status}`);
      } catch {
        setApiStatus("Não foi possível conectar à API.");
      }
    }

    checkHealth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold text-gold-400">{APP_NAME}</h1>
      <p className="text-slate-400">{apiStatus}</p>
    </main>
  );
}

export default App;
