import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play } from 'lucide-react';
import { api } from '@/lib/api';

interface PromptToClipPanelProps {
  topicId: string;
  videoId: string;
}

export function PromptToClipPanel({ topicId, videoId }: PromptToClipPanelProps) {
  const [prompt, setPrompt] = useState('');

  const searchMutation = useMutation({
    mutationFn: (searchPrompt: string) => api.promptTopicClip(topicId, searchPrompt),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Inside This Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., What is supervised learning?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={searchMutation.isPending}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        {searchMutation.data && searchMutation.data.bestMatch && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold mb-2">Best Match</h4>
              <div className="p-3 bg-primary/10 rounded-md">
                <p className="font-medium text-sm">{searchMutation.data.bestMatch.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(searchMutation.data.bestMatch.startSeconds)} -{' '}
                  {formatTime(searchMutation.data.bestMatch.endSeconds)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {searchMutation.data.bestMatch.transcriptExcerpt}
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-3"
                >
                  <a
                    href={`/videos/${videoId}/player?t=${searchMutation.data.bestMatch.startSeconds}`}
                  >
                    <Play className="h-3 w-3 mr-2" />
                    Replace player with this clip
                  </a>
                </Button>
              </div>
            </div>

            {searchMutation.data && searchMutation.data.related.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Related Clips</h4>
                <div className="space-y-2">
                  {searchMutation.data.related.map((related) => (
                    <div
                      key={related.topicId}
                      className="p-2 border rounded-md hover:bg-accent transition-colors"
                    >
                      <p className="text-sm font-medium">{related.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(related.startSeconds)} - {formatTime(related.endSeconds)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
