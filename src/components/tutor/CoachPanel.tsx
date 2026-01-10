import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trophy, AlertCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoachPanelProps {
  mastery: Record<
    string,
    {
      masteryScore: number;
      confidence: string;
      lastAssessedAt: Date | null;
    }
  > | null;
  skills: string[];
  labs: Array<{ labId: string; title: string }>;
  drill: { drillId: string; questions: any[] } | null;
}

export function CoachPanel({ mastery, skills: _skills, labs, drill }: CoachPanelProps) {
  const getWeakestSkills = () => {
    if (!mastery) return [];
    return Object.entries(mastery)
      .sort((a, b) => a[1].masteryScore - b[1].masteryScore)
      .slice(0, 3)
      .map(([skillId, data]) => ({ skillId, ...data }));
  };

  const weakestSkills = getWeakestSkills();
  const avgMastery = mastery
    ? Object.values(mastery).reduce((sum, m) => sum + m.masteryScore, 0) /
      Object.values(mastery).length
    : 0;

  return (
    <Card className="sticky top-4 border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Coach Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mastery Score */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Mastery Score</span>
            <span className="text-3xl font-bold text-primary">{Math.round(avgMastery)}%</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${avgMastery}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Confidence: <span className="font-medium text-foreground">{mastery ? Object.values(mastery)[0]?.confidence || 'Low' : 'Low'}</span>
          </p>
        </div>

        <Separator />

        {/* Your Gap */}
        {weakestSkills.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Your Gap
            </h4>
            <ul className="space-y-2">
              {weakestSkills.map((skill) => (
                <li key={skill.skillId} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{skill.skillId}</span>
                    <span className="text-muted-foreground ml-2">
                      {Math.round(skill.masteryScore)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Next Best Actions */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Next Best Actions
          </h4>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-medium text-primary">1.</span>
              <span>Watch this clip again or related clip</span>
            </li>
            {labs.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="font-medium text-primary">2.</span>
                <span>Do lab: {labs[0].title}</span>
              </li>
            )}
            {drill && (
              <li className="flex items-start gap-2">
                <span className="font-medium text-primary">3.</span>
                <span>Take micro-drill</span>
              </li>
            )}
          </ol>
        </div>

        <Separator />

        {/* Ask Coach */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ask Coach
          </h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-left">
              Give me an exam-style scenario
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-left">
              Explain my wrong answers
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-left">
              Make a 10-min revision plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

