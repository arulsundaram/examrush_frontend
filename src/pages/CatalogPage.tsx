import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || '');

  const { data, isLoading } = useQuery({
    queryKey: ['videos', { query, tag: tagFilter, level: levelFilter }],
    queryFn: () => api.getVideos({ query, tag: tagFilter, level: levelFilter }),
  });

  const videos = data?.videos || [];

  const allTags = Array.from(
    new Set(videos.flatMap((v: any) => v.tags || []))
  );

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setQuery(params.get('query') || '');
    setTagFilter(params.get('tag') || '');
    setLevelFilter(params.get('level') || '');
  }, [searchParams]);

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Level</label>
                <select
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    handleFilterChange('level', e.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Tags</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allTags.slice(0, 10).map((tag) => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="tag"
                        value={tag}
                        checked={tagFilter === tag}
                        onChange={(e) => {
                          setTagFilter(e.target.value);
                          handleFilterChange('tag', e.target.value);
                        }}
                        className="rounded border-primary text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search videos, topics, or concepts..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleFilterChange('query', e.target.value);
            }}
            className="max-w-md h-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No videos found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any) => (
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
                <CardContent className="pt-0 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {video.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{video.level}</span> •{' '}
                      <span>{Math.floor(video.durationSeconds / 60)} min</span>
                    </div>
                    <Button asChild size="sm" className="font-medium">
                      <Link to={`/videos/${video.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

