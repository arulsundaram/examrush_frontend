import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, BookOpen, Award } from 'lucide-react';

export function AchievementsPage() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: api.getAchievements,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const xp = achievements?.xp || 0;
  const streak = achievements?.streakCount || 0;
  const recentProgress = achievements?.recentProgress || [];

  // Calculate level based on XP (1000 XP per level)
  const level = Math.floor(xp / 1000) + 1;
  const xpProgress = xp % 1000;
  const xpProgressPercent = (xpProgress / 1000) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">
          Track your learning progress and accomplishments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{xp.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Level {level} • {xpProgress}/{1000} to next level
            </p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep learning to maintain your streak!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentProgress.filter((p) => p.progressPercent === 100).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Videos completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recently watched videos and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentProgress.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No recent activity. Start watching videos to see your progress here!
            </p>
          ) : (
            <div className="space-y-4">
              {recentProgress.map((progress) => (
                <div
                  key={progress.videoId}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-24 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    {progress.thumbnailUrl ? (
                      <img
                        src={progress.thumbnailUrl}
                        alt={progress.videoTitle}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {progress.videoTitle}
                    </h3>
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>{progress.progressPercent}% complete</span>
                        <span>
                          {new Date(progress.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/videos/${progress.videoId}/player`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Badges
          </CardTitle>
          <CardDescription>
            Earn badges by completing milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'First Steps', earned: xp > 0 },
              { name: 'Learner', earned: xp > 500 },
              { name: 'Scholar', earned: xp > 2000 },
              { name: 'Master', earned: xp > 5000 },
              { name: 'Week Warrior', earned: streak >= 7 },
              { name: 'Month Master', earned: streak >= 30 },
            ].map((badge) => (
              <div
                key={badge.name}
                className={`p-4 border rounded-lg text-center ${
                  badge.earned
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted/50 opacity-50'
                }`}
              >
                <Award
                  className={`h-8 w-8 mx-auto mb-2 ${
                    badge.earned ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <p className="text-sm font-medium">{badge.name}</p>
                {badge.earned && (
                  <p className="text-xs text-muted-foreground mt-1">Earned</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

