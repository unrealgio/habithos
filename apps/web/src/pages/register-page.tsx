import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/layouts/auth-layout";

export function RegisterPage() {
  return (
    <AuthLayout
      title="Criar conta"
      description="Comece sua jornada no Habithos."
      footer={
        <p className="text-sm text-muted-foreground">
          Já tem conta?
          <Button asChild variant="link">
            <Link to="/login">Entrar</Link>
          </Button>
        </p>
      }
    >
      <p className="text-sm text-muted-foreground">Formulário em construção.</p>
    </AuthLayout>
  );
}
