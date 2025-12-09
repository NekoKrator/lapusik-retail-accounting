import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "./ui/spinner";
import { TypographyMuted } from "./ui/typography";

type LoadingScreenProps = {
  message: string;
};

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="items-center justify-center pt-8">
          <Image
            alt="Зоомагазин Лапусик"
            height={99}
            priority
            src="/lapusik-logo.png"
            width={225}
          />
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-3">
          <CardTitle className="text-muted-foreground">
            <Spinner />
          </CardTitle>
          <CardDescription>
            <TypographyMuted className="line-clamp-2 text-lg">
              {message}
            </TypographyMuted>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
