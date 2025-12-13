"use client";

import { Lock, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import { signIn } from "@/lib/actions/auth-actions";

export default function AuthClientPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(username, password);

    if (result?.ok) {
      router.push("/dashboard");
      return;
    }

    toast.error("Помилка автентифікації", {
      description: result?.error.message,
      position: "top-center",
    });

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="flex justify-center">
          <Image
            alt="Зоомагазин Лапусик"
            className="h-auto w-auto"
            height={120}
            priority
            src="/lapusik-logo.png"
            width={300}
          />
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-bold text-2xl">
              Вхід для співробітників
            </CardTitle>
            <CardDescription>
              Введіть дані для доступу до системи
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <InputGroup>
                      <InputGroupInput
                        autoComplete="username"
                        disabled={isLoading}
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Логін відділення"
                        required
                        type="text"
                        value={username}
                      />
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <InputGroup>
                      <InputGroupInput
                        disabled={isLoading}
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        required
                        type="password"
                        value={password}
                      />
                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <Button
                      disabled={isLoading}
                      type="submit"
                      variant="default"
                    >
                      {isLoading ? (
                        <>
                          <Spinner />
                          Вхід...
                        </>
                      ) : (
                        "Увійти"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <TypographyMuted className="text-center">
          © 2025 Зоомагазин Лапусик. Система для співробітників.
        </TypographyMuted>
      </div>
    </div>
  );
}
