import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/layouts/auth-layout";

export function LoginPage() {
  return (
    <AuthLayout
      title="Entrar"
      description="Acesse sua conta para continuar sua jornada."
      footer={
        <p className="text-sm text-muted-foreground">
          Ainda não tem conta?
          <Button asChild variant="link">
            <Link to="/register">Criar conta</Link>
          </Button>
        </p>
      }
    >
      <p className="text-sm text-muted-foreground">Formulário em construção.</p>
    </AuthLayout>
  );
}
