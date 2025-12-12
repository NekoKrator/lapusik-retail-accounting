import { ChartBar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";

export default function Page() {
  return (
    <Card className="h-full w-full rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar />
          <TypographyH3>Статистика</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">Тут буде Статистика</CardContent>
    </Card>
  );
}
