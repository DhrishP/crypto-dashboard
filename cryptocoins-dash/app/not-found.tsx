import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            The page you&apos;re looking for doesn&apos;t exist or the coin was
            not found.
          </p>
          <div className="flex justify-center gap-2">
            <Button asChild>
              <Link href="/eth">Go to Ethereum</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/bitcoin">Go to Bitcoin</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
