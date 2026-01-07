import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { GraduationCap, Play, ChevronDown, ChevronRight, BookOpen, Target, Tag, Lightbulb, Video, Hash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Component to render Tutor Mode button when first topic is available
function TutorModeButton({ videoId, examCode = 'AI-102' }: { videoId: string; examCode?: string }) {
  const { data: topicsData } = useQuery({
    queryKey: ['topics', videoId],
    queryFn: () => api.getTopics(videoId),
    enabled: !!videoId,
  });

  const topics = (topicsData?.topics as any[]) || [];
  const firstTopic = topics.length > 0 ? topics[0] : null;

  if (!firstTopic) {
    return null;
  }

  return (
    <Button asChild size="sm" variant="outline" className="font-light text-xs">
      <Link to={`/exams/${examCode}/topics/${firstTopic.id}`}>
        <GraduationCap className="h-3 w-3 mr-1.5" />
        Tutor Mode
      </Link>
    </Button>
  );
}

// Video Card Component
function VideoCard({ video, examCode, showTopics = false }: { video: any; examCode?: string; showTopics?: boolean }) {
  return (
    <div
      className="border rounded-lg p-3 hover:shadow-md transition-all group"
      style={{ 
        backgroundColor: '#ffffff',
        borderColor: '#dbe4fe'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0d0f2c';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 15, 44, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#dbe4fe';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="space-y-2">
        {video.thumbnailUrl && (
          <div className="w-full h-32 rounded-md overflow-hidden bg-muted mb-2">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h5 className="text-sm font-light line-clamp-2" style={{ color: '#0d0f2c' }}>
          {video.title}
        </h5>
        {video.description && (
          <p className="text-xs font-light line-clamp-2" style={{ color: '#a4abc3' }}>
            {video.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs font-light" style={{ color: '#6b7280' }}>
          <span>{Math.floor((video.durationSeconds || 0) / 60)} min</span>
          {video.level && (
            <>
              <span>•</span>
              <span>{video.level}</span>
            </>
          )}
          {showTopics && video.topics && video.topics.length > 0 && (
            <>
              <span>•</span>
              <span>{video.topics.length} topics</span>
            </>
          )}
        </div>
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {video.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span 
                key={idx}
                className="text-xs font-light px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#dee5fc', color: '#0d0f2c' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Button asChild size="sm" variant="outline" className="font-light text-xs h-7">
            <Link to={`/videos/${video.id}`}>
              <Play className="h-3 w-3 mr-1" />
              Watch
            </Link>
          </Button>
          {examCode && <TutorModeButton videoId={video.id} examCode={examCode} />}
        </div>
      </div>
    </div>
  );
}

export function CertificationPage() {
  const { examCode } = useParams<{ examCode: string }>();
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'domains' | 'concepts' | 'tags' | 'demos'>('domains');

  const { data: examData, isLoading } = useQuery({
    queryKey: ['exam', examCode],
    queryFn: () => api.getExam(examCode!),
    enabled: !!examCode,
  });

  const exam = examData?.exam;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading certification details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Certification not found</p>
      </div>
    );
  }

  const toggleDomain = (domainId: string) => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainId)) {
        next.delete(domainId);
      } else {
        next.add(domainId);
      }
      return next;
    });
  };

  // Get unique videos organized by domain and objective
  const getVideosByDomain = () => {
    if (!exam) return [];
    
    return exam.domains.map((domain) => {
      const videosByObjective = domain.objectives.map((objective) => {
        const videos = Array.from(
          new Map(
            objective.topics.map((t) => [t.video.id, t.video])
          ).values()
        );
        return {
          objective,
          videos,
        };
      });
      
      return {
        domain,
        objectives: videosByObjective,
      };
    });
  };

  const domainsWithVideos = getVideosByDomain();
  const totalVideos = exam.totalVideos || exam.domains.reduce(
    (sum, d) => sum + new Set(d.objectives.flatMap((o) => o.topics.map((t) => t.video.id))).size,
    0
  );

  return (
    <div className="h-full" style={{ backgroundColor: '#f5f6f8' }}>
      <div className="p-6 space-y-6">
        {/* Clean Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
      <div>
              <h1 className="text-2xl font-light tracking-tight" style={{ color: '#0d0f2c' }}>
                {exam.code}: {exam.title}
              </h1>
              {exam.description && (
                <p className="text-sm font-light mt-1" style={{ color: '#a4abc3' }}>
                  {exam.description}
                </p>
              )}
      </div>
                </div>
          <div className="flex items-center gap-4 text-xs font-light" style={{ color: '#6b7280' }}>
            <span>{exam.domains.length} Domains</span>
            <span>•</span>
            <span>{totalVideos} Videos</span>
            <span>•</span>
            <span>{exam.domains.reduce((sum, d) => sum + d.objectives.length, 0)} Objectives</span>
            {exam.totalTopics && (
              <>
                <span>•</span>
                <span>{exam.totalTopics} Topics</span>
                    </>
                  )}
                </div>
              </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4" style={{ backgroundColor: '#ffffff', borderColor: '#dbe4fe' }}>
            <TabsTrigger value="domains" className="font-light text-xs">
              <Target className="h-3.5 w-3.5 mr-1.5" />
              Domains & Objectives
            </TabsTrigger>
            <TabsTrigger value="concepts" className="font-light text-xs">
              <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
              Concepts ({exam.videosByConcepts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="tags" className="font-light text-xs">
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              Technical Tags ({exam.videosByTechTags?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="demos" className="font-light text-xs">
              <Video className="h-3.5 w-3.5 mr-1.5" />
              Demo Videos ({exam.demoVideos?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Domains & Objectives Tab */}
          <TabsContent value="domains" className="mt-6">
                <div className="space-y-3">
              {domainsWithVideos.map(({ domain, objectives }) => {
                const isExpanded = expandedDomains.has(domain.id);
                const domainVideos = Array.from(
                  new Map(
                    domain.objectives.flatMap((o) => o.topics.map((t) => [t.video.id, t.video]))
                  ).values()
                );

                return (
                  <div
                    key={domain.id}
                    className="border rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#ffffff', borderColor: '#dbe4fe' }}
                  >
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" style={{ color: '#0d0f2c' }} />
                        ) : (
                          <ChevronRight className="h-4 w-4" style={{ color: '#0d0f2c' }} />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-light" style={{ color: '#0d0f2c' }}>
                              {domain.code}: {domain.title}
                            </h3>
                            <span className="text-xs font-light px-2 py-0.5 rounded" style={{ backgroundColor: '#dee5fc', color: '#0d0f2c' }}>
                              {objectives.length} objectives
                            </span>
                          </div>
                          {domain.description && (
                            <p className="text-xs font-light mt-1" style={{ color: '#a4abc3' }}>
                              {domain.description}
                            </p>
                        )}
                        </div>
                      </div>
                      <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                        {domainVideos.length} videos
                          </span>
                    </button>

                    {isExpanded && (
                      <div className="border-t" style={{ borderColor: '#dbe4fe' }}>
                        <div className="p-4 space-y-4">
                          {objectives.map(({ objective, videos }) => (
                            <div key={objective.id} className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Target className="h-3.5 w-3.5" style={{ color: '#0d0f2c' }} />
                                <h4 className="text-sm font-light" style={{ color: '#0d0f2c' }}>
                                  {objective.code}: {objective.title}
                                </h4>
                                {objective.description && (
                                  <span className="text-xs font-light" style={{ color: '#a4abc3' }}>
                                    • {objective.description}
                          </span>
                                )}
                              </div>
                              
                              {videos.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                                  {videos.map((video: any) => (
                                    <VideoCard key={video.id} video={video} examCode={examCode} />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Concepts Tab */}
          <TabsContent value="concepts" className="mt-6">
            {exam.videosByConcepts && exam.videosByConcepts.length > 0 ? (
              <div className="space-y-6">
                {exam.videosByConcepts.map(({ concept, videos }) => (
                  <div key={concept} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" style={{ color: '#0d0f2c' }} />
                      <h3 className="text-base font-light" style={{ color: '#0d0f2c' }}>
                        {concept}
                      </h3>
                      <span className="text-xs font-light px-2 py-0.5 rounded" style={{ backgroundColor: '#dee5fc', color: '#0d0f2c' }}>
                        {videos.length} video{videos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {videos.map((item: any, idx: number) => (
                        <VideoCard 
                          key={`${item.video.id}-${idx}`} 
                          video={item.video} 
                          examCode={examCode}
                        />
                      ))}
                    </div>
                    </div>
                  ))}
                </div>
              ) : (
              <div className="text-center py-12 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #dbe4fe' }}>
                <p className="text-sm font-light" style={{ color: '#a4abc3' }}>
                  No concept videos available yet
                </p>
              </div>
            )}
          </TabsContent>

          {/* Technical Tags Tab */}
          <TabsContent value="tags" className="mt-6">
            {exam.videosByTechTags && exam.videosByTechTags.length > 0 ? (
              <div className="space-y-6">
                {exam.videosByTechTags.map(({ tag, videos }) => (
                  <div key={tag} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" style={{ color: '#0d0f2c' }} />
                      <h3 className="text-base font-light" style={{ color: '#0d0f2c' }}>
                        {tag}
                      </h3>
                      <span className="text-xs font-light px-2 py-0.5 rounded" style={{ backgroundColor: '#dee5fc', color: '#0d0f2c' }}>
                        {videos.length} video{videos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {videos.map((item: any, idx: number) => (
                        <VideoCard 
                          key={`${item.video.id}-${idx}`} 
                          video={item.video} 
                          examCode={examCode}
                        />
                      ))}
                    </div>
                  </div>
        ))}
      </div>
            ) : (
              <div className="text-center py-12 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #dbe4fe' }}>
                <p className="text-sm font-light" style={{ color: '#a4abc3' }}>
                  No technical tag videos available yet
                </p>
              </div>
            )}
          </TabsContent>

          {/* Demo Videos Tab */}
          <TabsContent value="demos" className="mt-6">
            {exam.demoVideos && exam.demoVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exam.demoVideos.map((video: any) => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    examCode={examCode}
                    showTopics={true}
                  />
                ))}
            </div>
            ) : (
              <div className="text-center py-12 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #dbe4fe' }}>
                <p className="text-sm font-light" style={{ color: '#a4abc3' }}>
                  No demo videos available yet
              </p>
            </div>
            )}
          </TabsContent>
        </Tabs>
          </div>
    </div>
  );
}
