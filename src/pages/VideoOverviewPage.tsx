import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Play, Search, Clock, GraduationCap } from 'lucide-react';

export function VideoOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);

  const { data: video } = useQuery({
    queryKey: ['video', id],
    queryFn: () => api.getVideo(id!),
    enabled: !!id,
  });

  const { data: topicsData } = useQuery({
    queryKey: ['topics', id],
    queryFn: () => api.getTopics(id!),
    enabled: !!id,
  });

  const searchMutation = useMutation({
    mutationFn: (promptText: string) => api.searchClips(id!, promptText),
    onSuccess: (data) => {
      setSearchResults(data);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      searchMutation.mutate(prompt);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const topics = topicsData?.topics || [];

  return (
    <div className="space-y-6">
      {/* Video Header */}
      {video && (
        <div>
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          <p className="text-muted-foreground mb-4">{video.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {Math.floor(video.durationSeconds / 60)} minutes
            </span>
            <span>{video.level}</span>
            <div className="flex gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild>
              <Link to={`/videos/${id}/player`}>
                <Play className="h-4 w-4 mr-2" />
                Watch Video
              </Link>
            </Button>
            {topics.length > 0 && (
              <Button asChild variant="outline">
                <Link to={`/exams/AI-102/topics/${topics[0].id}`}>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Tutor Mode
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Clip Finder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find inside this video
          </CardTitle>
          <CardDescription>
            Enter a topic or question to find relevant clips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              type="text"
              placeholder="e.g., What is machine learning?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button type="submit" disabled={searchMutation.isPending}>
              {searchMutation.isPending ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {searchResults && (
            <div className="mt-6 space-y-6">
              {/* Best Match */}
              <div>
                <h3 className="font-semibold mb-2">Best Match</h3>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {searchResults.bestMatch.title}
                      </CardTitle>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          searchResults.bestMatch.confidence === 'High'
                            ? 'bg-green-100 text-green-800'
                            : searchResults.bestMatch.confidence === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {searchResults.bestMatch.confidence} Confidence
                      </span>
                    </div>
                    <CardDescription>
                      {formatTime(searchResults.bestMatch.startSeconds)} -{' '}
                      {formatTime(searchResults.bestMatch.endSeconds)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {searchResults.bestMatch.transcriptExcerpt}
                    </p>
                    <Button
                      asChild
                      className="mt-4"
                      size="sm"
                      variant="outline"
                    >
                      <Link
                        to={`/videos/${id}/player?t=${searchResults.bestMatch.startSeconds}`}
                      >
                        Jump to Clip
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Related Topics */}
              {searchResults.related.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Related Topics</h3>
                  <div className="space-y-2">
                    {searchResults.related.map((topic: any) => (
                      <Card key={topic.topicId}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{topic.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatTime(topic.startSeconds)} -{' '}
                                {formatTime(topic.endSeconds)}
                              </p>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                            >
                              <Link
                                to={`/videos/${id}/player?t=${topic.startSeconds}`}
                              >
                                View
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Topics */}
              <div>
                <h3 className="font-semibold mb-2">All Topics</h3>
                <div className="space-y-1">
                  {searchResults.allTopics.map((topic: any) => (
                    <div
                      key={topic.topicId}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                    >
                      <div>
                        <span className="text-sm font-medium">{topic.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatTime(topic.startSeconds)} -{' '}
                          {formatTime(topic.endSeconds)}
                        </span>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                      >
                        <Link
                          to={`/videos/${id}/player?t=${topic.startSeconds}`}
                        >
                          Go
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Topics List */}
      {topics.length > 0 && !searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>All Topics ({topics.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topics.map((topic: any) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                >
                  <div>
                    <span className="text-sm font-medium">{topic.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatTime(topic.startSeconds)} -{' '}
                      {formatTime(topic.endSeconds)}
                    </span>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/videos/${id}/player?t=${topic.startSeconds}`}>
                      Go
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

