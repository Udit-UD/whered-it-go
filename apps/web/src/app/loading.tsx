import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <div className="relative">
            <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we load your content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
