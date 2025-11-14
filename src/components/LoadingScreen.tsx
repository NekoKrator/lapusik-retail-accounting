import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { LoadingScreenProps } from "@/types/types";
import { Spinner } from "./ui/spinner";
import { TypographyMuted } from "./ui/typography";

export default function LoadingScreen({ message }: LoadingScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                    <Image
                        src="/lapusik-logo.png"
                        alt="Зоомагазин Лапусик"
                        width={225}
                        height={90}
                        className="h-auto max-w-full"
                        priority
                    />

                    <TypographyMuted className="text-lg flex items-center gap-3">
                        <Spinner />
                        {message}
                    </TypographyMuted>

                    {/* Animated dots
          <div className='flex space-x-1'>
            <div
              className='w-2 h-2 bg-[#03933a] rounded-full animate-bounce'
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className='w-2 h-2 bg-[#fcfe06] rounded-full animate-bounce'
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className='w-2 h-2 bg-[#03933a] rounded-full animate-bounce'
              style={{ animationDelay: '300ms' }}
            ></div>
          </div> */}
                </CardContent>
            </Card>
        </div>
    );
}
