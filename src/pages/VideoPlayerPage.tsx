import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Pause, BookOpen, Lightbulb, FileText, Award } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  keywords?: string[];
  transcriptExcerpt?: string;
  certificationObjective?: string;
}

export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState('concepts');

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

  const progressMutation = useMutation({
    mutationFn: api.updateProgress,
  });

  const topics = (topicsData?.topics || []) as Topic[];

  useEffect(() => {
    const startTime = searchParams.get('t');
    if (startTime && videoRef.current) {
      videoRef.current.currentTime = parseInt(startTime, 10);
    }
  }, [searchParams]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progressPercent = (video.currentTime / video.duration) * 100;
      
      // Update progress every 10 seconds
      if (Math.floor(video.currentTime) % 10 === 0) {
        progressMutation.mutate({
          videoId: id!,
          progressPercent: Math.round(progressPercent),
          lastPositionSeconds: Math.floor(video.currentTime),
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [id, progressMutation]);

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

  const jumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTopic = topics.find(
    (topic) =>
      currentTime >= topic.startSeconds && currentTime <= topic.endSeconds
  );

  return (
    <div className="flex gap-6">
      {/* Main Video Area */}
      <div className="flex-1 space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black rounded-t-lg">
              <video
                ref={videoRef}
                className="w-full h-full"
                src={video?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute bottom-4 left-4">
                <Button
                  size="icon"
                  onClick={handlePlayPause}
                  className="bg-black/50 hover:bg-black/70"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{video?.title}</h2>
              <p className="text-sm text-muted-foreground">
                {video?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chapters/Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topics.map((topic) => {
                const isActive =
                  currentTime >= topic.startSeconds &&
                  currentTime <= topic.endSeconds;
                return (
                  <div
                    key={topic.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => jumpToTime(topic.startSeconds)}
                  >
                    <div>
                      <div className="font-medium text-sm">{topic.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(topic.startSeconds)} -{' '}
                        {formatTime(topic.endSeconds)}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel */}
      <aside className="w-80 space-y-4">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>AI Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="concepts">Concepts</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>
              <TabsContent value="concepts" className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  Key Concepts
                </div>
                {currentTopic ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{currentTopic.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentTopic.keywords?.slice(0, 5).map((keyword: string) => (
                        <span
                          key={keyword}
                          className="text-xs px-2 py-1 bg-secondary rounded-md"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentTopic.transcriptExcerpt}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Play the video to see key concepts
                  </p>
                )}
              </TabsContent>
              <TabsContent value="explanation" className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4" />
                  AI Explanation
                </div>
                {currentTopic ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      {currentTopic.transcriptExcerpt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This section covers {currentTopic.title.toLowerCase()}. 
                      Key points include understanding the fundamental concepts 
                      and practical applications.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Play the video to get AI explanations
                  </p>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Notes
              </div>
              <p className="text-sm text-muted-foreground">
                Notes feature coming soon
              </p>
            </div>

            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Award className="h-4 w-4" />
                Certification Mapping
              </div>
              {currentTopic?.certificationObjective ? (
                <p className="text-sm text-muted-foreground">
                  {currentTopic.certificationObjective}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No certification objective mapped
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

