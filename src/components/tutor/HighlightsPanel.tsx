import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, XCircle, Target, Play } from 'lucide-react';

interface HighlightsPanelProps {
  highlights: string[];
  relevantVideos?: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    durationSeconds: number;
  }>;
}

export function HighlightsPanel({ highlights, relevantVideos }: HighlightsPanelProps) {
  const getIcon = (highlight: string) => {
    if (highlight.toLowerCase().includes('most asked')) {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
    if (highlight.toLowerCase().includes('pitfall')) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    if (highlight.toLowerCase().includes('decision')) {
      return <Target className="h-4 w-4 text-blue-600" />;
    }
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highlights (Trainer Callouts)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-md">
              {getIcon(highlight)}
              <p className="text-sm flex-1">{highlight}</p>
            </div>
          ))}
        </div>

        {relevantVideos && relevantVideos.length > 0 && (
          <div className="pt-4 border-t mt-4">
            <h4 className="font-semibold mb-3 text-sm">Recommended Videos</h4>
            <div className="grid grid-cols-2 gap-3">
              {relevantVideos.slice(0, 4).map((video) => (
                <Link
                  key={video.id}
                  to={`/videos/${video.id}`}
                  className="group block"
                >
                  <div className="aspect-video bg-muted rounded-md overflow-hidden mb-2 relative">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(video.durationSeconds / 60)} min
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
