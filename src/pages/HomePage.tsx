import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

export function HomePage() {
  const { data: videosData } = useQuery({
    queryKey: ['videos', { sort: 'newest' }],
    queryFn: () => api.getVideos({ sort: 'newest' }),
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['achievements'],
    queryFn: api.getAchievements,
  });

  const videos = videosData?.videos || [];
  const recentVideos = videos.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground text-lg">
          Continue your learning journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {achievementsData?.xp || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Experience points</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {achievementsData?.streakCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Videos Available</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{videos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to learn</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Latest Videos</h2>
            <p className="text-sm text-muted-foreground mt-1">Start learning with our newest content</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/catalog">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentVideos.map((video: any) => (
            <Card key={video.id} className="overflow-hidden group hover:shadow-lg transition-all duration-200">
              <CardHeader className="p-0">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <BookOpen className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg leading-tight">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">
                    {Math.floor(video.durationSeconds / 60)} min
                  </span>
                  <Button asChild size="sm" className="font-medium">
                    <Link to={`/videos/${video.id}`}>Watch</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

