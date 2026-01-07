import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Play } from 'lucide-react';

interface MicroDrillPanelProps {
  drill: {
    drillId: string;
    questions: Array<{
      id: string;
      questionText: string;
      options: Array<{ id: string; text: string }>;
    }>;
  } | null;
  relevantVideos?: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    durationSeconds: number;
  }>;
}

export function MicroDrillPanel({ drill, relevantVideos }: MicroDrillPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  if (!drill) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Micro-Drill</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">No drill available for this topic.</p>
          {relevantVideos && relevantVideos.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-sm">Study These Videos First</h4>
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

  const handleSubmit = () => {
    // In a real implementation, this would call the API
    // For MVP, we'll use mock correct answers
    const mockCorrectAnswers: Record<string, string> = {
      q1: 'a1',
      q2: 'a2',
      q3: 'a1',
      q4: 'a2',
      q5: 'a1',
    };

    const newResults: Record<string, boolean> = {};
    drill.questions.forEach((q) => {
      newResults[q.id] = answers[q.id] === mockCorrectAnswers[q.id];
    });

    setResults(newResults);
    setSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Micro-Drill (5 Questions)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {drill.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.questionText}</h4>
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;
                const isCorrect = results[question.id] && option.id === answers[question.id];
                const isWrong = submitted && isSelected && !results[question.id];

                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                    } ${submitted && isCorrect ? 'bg-green-50 border-green-500' : ''}
                    ${submitted && isWrong ? 'bg-red-50 border-red-500' : ''}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question.id]: e.target.value })
                      }
                      disabled={submitted}
                      className="sr-only"
                    />
                    <span className="flex-1">{option.text}</span>
                    {submitted && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {submitted && isWrong && <XCircle className="h-5 w-5 text-red-600" />}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full" disabled={Object.keys(answers).length !== drill.questions.length}>
            Submit Answers
          </Button>
        ) : (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">
              Score: {Object.values(results).filter(Boolean).length} / {drill.questions.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Mastery updated based on your performance.
            </p>
          </div>
        )}

        {relevantVideos && relevantVideos.length > 0 && (
          <div className="pt-4 border-t mt-4">
            <h4 className="font-semibold mb-3 text-sm">Review Videos</h4>
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
