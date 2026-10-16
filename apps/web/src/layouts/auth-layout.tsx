import type { ReactNode } from "react";
import { APP_NAME } from "@habithos/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-4xl font-bold text-gold-400">{APP_NAME}</h1>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && <CardFooter className="justify-center">{footer}</CardFooter>}
      </Card>
    </main>
  );
}
