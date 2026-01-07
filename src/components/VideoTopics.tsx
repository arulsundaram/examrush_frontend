import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { BookOpen } from 'lucide-react';

interface VideoTopicsProps {
  videoId: string;
  showCount?: boolean;
  showPreview?: boolean;
}

export function VideoTopics({ videoId, showCount = true, showPreview = false }: VideoTopicsProps) {
  const { data: topicsData, isLoading } = useQuery({
    queryKey: ['topics', videoId],
    queryFn: () => api.getTopics(videoId),
    enabled: !!videoId,
  });

  const topics = (topicsData?.topics as any[]) || [];

  if (isLoading) {
    if (showCount) {
      return (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <BookOpen className="h-3 w-3 animate-pulse" />
          Loading...
        </span>
      );
    }
    return null;
  }

  if (topics.length === 0) {
    return null;
  }

  return (
    <>
      {showCount && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
        </span>
      )}
      {showPreview && topics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Topics:</p>
          <div className="flex flex-wrap gap-1.5">
            {topics.slice(0, 4).map((topic: any) => (
              <Link
                key={topic.id}
                to={`/exams/AI-102/topics/${topic.id}`}
                className="text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors font-medium"
              >
                {topic.title}
              </Link>
            ))}
            {topics.length > 4 && (
              <span className="text-xs px-2 py-1 text-muted-foreground">
                +{topics.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

