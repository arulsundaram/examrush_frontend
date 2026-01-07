import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BookOpen, Play } from 'lucide-react';

interface KeyConceptsPanelProps {
  concepts: string[];
  examAngleNotes?: string;
  relevantVideos?: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    durationSeconds: number;
  }>;
}

export function KeyConceptsPanel({ concepts, examAngleNotes, relevantVideos }: KeyConceptsPanelProps) {
  const [explainSimply, setExplainSimply] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            What You'll Learn
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExplainSimply(!explainSimply)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {explainSimply ? 'Standard View' : 'Explain Simply'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {concepts.map((concept, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span className={explainSimply ? 'text-sm leading-relaxed' : 'leading-relaxed'}>{concept}</span>
            </li>
          ))}
        </ul>

        {examAngleNotes && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2 text-sm">Exam Angle</h4>
            <p className="text-sm text-muted-foreground">{examAngleNotes}</p>
          </div>
        )}

        {relevantVideos && relevantVideos.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-3 text-sm">Related Videos</h4>
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
