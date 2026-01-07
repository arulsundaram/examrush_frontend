import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TechTagsPanelProps {
  tags: string[];
  relevantVideos?: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    durationSeconds: number;
  }>;
}

export function TechTagsPanel({ tags, relevantVideos }: TechTagsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Technical Tags & Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        {tags.length > 0 && (
          <Link
            to={`/catalog?tag=${tags[0]}`}
            className="text-sm text-primary hover:underline mt-4 inline-block"
          >
            View all topics with this tag →
          </Link>
        )}

        {relevantVideos && relevantVideos.length > 0 && (
          <div className="pt-4 border-t mt-4">
            <h4 className="font-semibold mb-3 text-sm">Videos with Similar Tags</h4>
            <div className="space-y-3">
              {relevantVideos.slice(0, 3).map((video) => (
                <Link
                  key={video.id}
                  to={`/videos/${video.id}`}
                  className="flex gap-3 group"
                >
                  <div className="w-24 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.floor(video.durationSeconds / 60)} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
