import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TutorPageLayout } from '@/components/tutor/TutorPageLayout';
import { TopicClipPlayer } from '@/components/tutor/TopicClipPlayer';
import { KeyConceptsPanel } from '@/components/tutor/KeyConceptsPanel';
import { TechTagsPanel } from '@/components/tutor/TechTagsPanel';
import { HighlightsPanel } from '@/components/tutor/HighlightsPanel';
import { LabsPanel } from '@/components/tutor/LabsPanel';
import { MicroDrillPanel } from '@/components/tutor/MicroDrillPanel';
import { PromptToClipPanel } from '@/components/tutor/PromptToClipPanel';
import { CoachPanel } from '@/components/tutor/CoachPanel';

export function TutorPage() {
  const { code, topicId } = useParams<{ code: string; topicId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tutor', code, topicId],
    queryFn: () => api.getTutorData(code!, topicId!),
    enabled: !!code && !!topicId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tutor mode...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load tutor data</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  // Get exam title from API if available
  const { data: examData } = useQuery({
    queryKey: ['exam', code],
    queryFn: () => api.getExam(code!),
    enabled: !!code,
  });

  const examTitle = examData?.exam?.title || code || 'Exam';

  return (
    <TutorPageLayout
      breadcrumb={{
        exam: { code: code!, title: examTitle },
        domain: data.blueprintContext.domain,
        objective: data.blueprintContext.objective,
        topic: { title: data.topic.title },
      }}
      leftContent={
        <div className="space-y-8">
          <TopicClipPlayer
            topic={data.topic}
            video={data.video}
            relatedTopics={data.relatedTopicsSameVideo}
          />
          <KeyConceptsPanel
            concepts={data.keyConcepts}
            examAngleNotes={data.topic.examAngleNotes}
            relevantVideos={data.relevantVideos}
          />
          <TechTagsPanel tags={data.techTags} relevantVideos={data.relevantVideos} />
          <HighlightsPanel highlights={data.highlights} relevantVideos={data.relevantVideos} />
          <LabsPanel labs={data.labs} relevantVideos={data.relevantVideos} />
          <MicroDrillPanel drill={data.microDrill} relevantVideos={data.relevantVideos} />
          <PromptToClipPanel topicId={topicId!} videoId={data.video.id} />
        </div>
      }
      rightContent={
        <CoachPanel
          mastery={data.mastery}
          skills={data.blueprintContext.skills}
          labs={data.labs}
          drill={data.microDrill}
        />
      }
    />
  );
}
