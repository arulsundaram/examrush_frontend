import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function ExamRushPage() {
  const { examCode } = useParams<{ examCode: string }>();
  const navigate = useNavigate();

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#0d0f2c', borderTopColor: 'transparent' }}></div>
          <p className="text-sm font-light" style={{ color: '#a4abc3' }}>Loading certification details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-light" style={{ color: '#a4abc3' }}>Certification not found</p>
      </div>
    );
  }

  return (
    <div className="h-full" style={{ backgroundColor: '#f5f6f8' }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/certification/${examCode}/modes`)}
            className="font-light"
            style={{ borderColor: '#dbe4fe', color: '#0d0f2c' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modes
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
              <Sparkles className="h-6 w-6" style={{ color: '#0d0f2c' }} />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight" style={{ color: '#0d0f2c' }}>
                AI Exam Rush: {exam.code}
              </h1>
              <p className="text-sm font-light mt-1" style={{ color: '#a4abc3' }}>
                {exam.title}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div 
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: '#ffffff', border: '1px solid #dbe4fe' }}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
              <Sparkles className="w-10 h-10" style={{ color: '#0d0f2c' }} />
            </div>
            <h2 className="text-xl font-light" style={{ color: '#0d0f2c' }}>
              AI Exam Rush Coming Soon
            </h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: '#6b7280' }}>
              This feature is currently under development. AI Exam Rush will provide personalized study paths, 
              adaptive practice questions, and intelligent exam preparation tailored to your learning style.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/certification/${examCode}/modes`)}
                className="font-light"
                style={{ borderColor: '#0d0f2c', color: '#0d0f2c' }}
              >
                Return to Mode Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

