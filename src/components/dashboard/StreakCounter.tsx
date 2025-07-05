import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export function StreakCounter({ currentStreak, longestStreak, className }: StreakCounterProps) {
  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🔥';
    if (days >= 14) return '⚡';
    if (days >= 7) return '🎯';
    if (days >= 3) return '💪';
    return '🌟';
  };

  const getStreakMessage = (days: number) => {
    if (days >= 30) return 'Amazing dedication!';
    if (days >= 14) return 'Great consistency!';
    if (days >= 7) return 'Building momentum!';
    if (days >= 3) return 'Good start!';
    if (days >= 1) return 'Keep it up!';
    return 'Start your streak today!';
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Logging Streak</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-center">
          <div className="text-4xl">{getStreakEmoji(currentStreak)}</div>
          <div className="space-y-1">
            <p className="text-primary text-3xl font-bold">{currentStreak}</p>
            <p className="text-muted-foreground text-sm">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </p>
          </div>
          <p className="text-muted-foreground text-xs font-medium">
            {getStreakMessage(currentStreak)}
          </p>
        </div>

        <div className="border-border border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Personal Best</span>
            <div className="text-right">
              <p className="text-foreground text-lg font-semibold">{longestStreak}</p>
              <p className="text-muted-foreground text-xs">
                {longestStreak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </div>

        {currentStreak > 0 && (
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-primary text-center text-xs font-medium">
              Don&apos;t break the chain! Log your expenses today to keep your streak alive.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
