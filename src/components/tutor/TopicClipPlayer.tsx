import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TopicClipPlayerProps {
  topic: {
    id: string;
    title: string;
    startSeconds: number;
    endSeconds: number;
    transcriptExcerpt: string;
  };
  video: {
    id: string;
    title: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  };
  relatedTopics: Array<{
    id: string;
    title: string;
    startSeconds: number;
    endSeconds: number;
  }>;
}

export function TopicClipPlayer({ topic, video, relatedTopics }: TopicClipPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = topic.startSeconds;
    }
  }, [topic.startSeconds]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const jumpToTopic = (startSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startSeconds;
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Clip Player</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            src={video.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={() => {
              if (videoRef.current && videoRef.current.currentTime >= topic.endSeconds) {
                videoRef.current.pause();
                setIsPlaying(false);
              }
            }}
          />
          <div className="absolute bottom-4 left-4">
            <Button size="icon" onClick={handlePlayPause} className="bg-black/50 hover:bg-black/70">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{topic.title}</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(topic.startSeconds)} - {formatTime(topic.endSeconds)}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={`/videos/${video.id}/player?t=${topic.startSeconds}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open full video
            </Link>
          </Button>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-2">Related Topics from This Video</h4>
          <div className="space-y-2">
            {relatedTopics.slice(0, 5).map((related) => (
              <button
                key={related.id}
                onClick={() => jumpToTopic(related.startSeconds)}
                className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium">{related.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(related.startSeconds)} - {formatTime(related.endSeconds)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
