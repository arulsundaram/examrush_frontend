import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Play } from 'lucide-react';
import { api } from '@/lib/api';

interface LabsPanelProps {
  labs: Array<{
    labId: string;
    title: string;
    steps: Array<{
      id: string;
      title: string;
      description: string;
      checklist: string[];
    }>;
    checklist: string[];
    tags: string[];
  }>;
  relevantVideos?: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    durationSeconds: number;
  }>;
}

export function LabsPanel({ labs, relevantVideos }: LabsPanelProps) {
  const queryClient = useQueryClient();
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<string>>>({});

  const completeLabMutation = useMutation({
    mutationFn: api.completeLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor'] });
    },
  });

  const toggleStep = (labId: string, stepId: string) => {
    setCompletedSteps((prev) => {
      const labSteps = prev[labId] || new Set();
      const newSteps = new Set(labSteps);
      if (newSteps.has(stepId)) {
        newSteps.delete(stepId);
      } else {
        newSteps.add(stepId);
      }
      return { ...prev, [labId]: newSteps };
    });
  };

  const isLabComplete = (lab: LabsPanelProps['labs'][0]) => {
    const labSteps = completedSteps[lab.labId] || new Set();
    return lab.steps.every((step) => labSteps.has(step.id));
  };

  if (labs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lab Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">No labs available for this topic.</p>
          {relevantVideos && relevantVideos.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-sm">Practice with These Videos</h4>
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

  return (
    <div className="space-y-4">
      {labs.map((lab) => (
        <Card key={lab.labId}>
          <CardHeader>
            <CardTitle>{lab.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {lab.steps.map((step) => {
                const isCompleted = completedSteps[lab.labId]?.has(step.id) || false;
                return (
                  <div key={step.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(lab.labId, step.id)}
                        className="mt-1"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                        {step.checklist && step.checklist.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {step.checklist.map((item, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isLabComplete(lab) && (
              <Button
                onClick={() => completeLabMutation.mutate(lab.labId)}
                disabled={completeLabMutation.isPending}
                className="w-full"
              >
                {completeLabMutation.isPending
                  ? 'Completing...'
                  : 'Mark Lab Complete'}
              </Button>
            )}

            {relevantVideos && relevantVideos.length > 0 && (
              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold mb-3 text-sm">Related Practice Videos</h4>
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
      ))}
    </div>
  );
}
