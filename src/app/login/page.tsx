"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, AlertCircleIcon } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { signIn, useSession } from "next-auth/react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router, mounted]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                username,
                password,
            });

            if (res?.ok) {
                router.push("/dashboard");
            } else {
                setError(res?.error || "Невірний логін або пароль");
            }
        } catch {
            setError("Помилка з'єднання");
        } finally {
            setLoading(false);
        }
    }

    if (!mounted || status === "loading") {
        return <LoadingScreen message="Перевірка авторизації..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo Section */}
                <div className="flex justify-center">
                    <Image
                        src="/lapusik-logo.png"
                        alt="Зоомагазин Лапусик"
                        width={300}
                        height={120}
                        className="h-auto max-w-full"
                        priority
                    />
                </div>

                {/* Login Card */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
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
                                    {error && (
                                        <Field>
                                            <Alert
                                                variant="destructive"
                                                className="bg-destructive/10 border-destructive/20"
                                            >
                                                <AlertCircleIcon />
                                                <AlertDescription className="text-red-700">
                                                    {error}
                                                </AlertDescription>
                                            </Alert>
                                        </Field>
                                    )}

                                    <Field>
                                        <FieldLabel>
                                            Логін відділення
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id="username"
                                                type="text"
                                                placeholder="Введіть логін відділення магазину"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                disabled={loading}
                                                required
                                            />
                                            <InputGroupAddon>
                                                <User />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Пароль</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id="password"
                                                type="password"
                                                placeholder="Введіть пароль відділення магазину"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                disabled={loading}
                                                required
                                            />
                                            <InputGroupAddon>
                                                <Lock />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>

                                    <Field>
                                        <Button
                                            type="submit"
                                            variant="default"
                                            disabled={loading}
                                        >
                                            {loading ? (
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
