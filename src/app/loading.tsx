import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we load your content
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
