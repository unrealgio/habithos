import { useEffect, useState } from "react";
import { Link } from "react-router";
import { APP_NAME } from "@habithos/shared";
import { Button } from "@/components/ui/button";

type HealthResponse = {
  status: string;
  app: string;
};

export function HomePage() {
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold text-gold-400">{APP_NAME}</h1>
      <p className="text-muted-foreground">{apiStatus}</p>

      <div className="flex gap-3">
        <Button asChild>
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/register">Criar conta</Link>
        </Button>
      </div>
    </main>
  );
}
