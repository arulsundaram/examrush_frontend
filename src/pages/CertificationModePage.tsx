import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Sparkles, ArrowRight, Play, Target, Lightbulb, Tag } from 'lucide-react';

export function CertificationModePage() {
  const { examCode } = useParams<{ examCode: string }>();
  const navigate = useNavigate();

  const { data: examData, isLoading, error } = useQuery({
    queryKey: ['exam', examCode],
    queryFn: () => api.getExam(examCode!),
    enabled: !!examCode,
  });

  const exam = examData?.exam;

  // Debug: Log to help troubleshoot
  console.log('CertificationModePage render:', { examCode, isLoading, error, exam: !!exam });

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-light" style={{ color: '#a4abc3' }}>Error loading certification: {error instanceof Error ? error.message : 'Unknown error'}</p>
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

  const domains = exam.domains || [];
  const totalVideos = exam.totalVideos || (domains.length > 0 ? domains.reduce(
    (sum, d) => sum + new Set((d.objectives || []).flatMap((o) => (o.topics || []).map((t) => t.video?.id).filter(Boolean))).size,
    0
  ) : 0);
  const totalObjectives = domains.reduce((sum, d) => sum + (d.objectives?.length || 0), 0);

  return (
    <div className="min-h-full" style={{ backgroundColor: '#f5f6f8' }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dee5fc' }}>
              <BookOpen className="h-6 w-6" style={{ color: '#0d0f2c' }} />
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
            <span>{domains.length} Domains</span>
            <span>•</span>
            <span>{totalVideos} Videos</span>
            <span>•</span>
            <span>{totalObjectives} Objectives</span>
            {exam.totalTopics && (
              <>
                <span>•</span>
                <span>{exam.totalTopics} Topics</span>
              </>
            )}
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Regular Video Mode */}
          <div
            className="border rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
            style={{ 
              backgroundColor: '#ffffff',
              borderColor: '#dbe4fe'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0d0f2c';
              e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(13, 15, 44, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#dbe4fe';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => navigate(`/certification/${examCode}`)}
          >
            {/* Header Section */}
            <div 
              className="h-32 relative overflow-hidden"
              style={{ backgroundColor: '#dee5fc' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" 
                  style={{ backgroundColor: '#ffffff', opacity: 0.95, boxShadow: '0 4px 12px rgba(13, 15, 44, 0.15)' }}
                >
                  <Video className="w-8 h-8" style={{ color: '#0d0f2c' }} />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span 
                  className="text-xs font-light px-3 py-1.5 rounded-lg uppercase tracking-wider"
                  style={{ backgroundColor: '#0d0f2c', color: '#ffffff', letterSpacing: '0.5px', fontSize: '10px' }}
                >
                  Regular Mode
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-light mb-2" style={{ color: '#0d0f2c' }}>
                  Regular Video Course
                </h2>
                <p className="text-sm font-light leading-relaxed" style={{ color: '#6b7280' }}>
                  Comprehensive exam preparation through structured video courses organized by topics and concepts. 
                  Explore all domains, objectives, and highlights at your own pace.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Organized by domains and objectives
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Browse by concepts and key topics
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Technical tags and highlights
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Play className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Full video library with tutor mode
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full mt-4 font-light"
                style={{ backgroundColor: '#0d0f2c', color: '#ffffff' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/certification/${examCode}`);
                }}
              >
                Start Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* AI Exam Rush Mode */}
          <div
            className="border rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
            style={{ 
              backgroundColor: '#ffffff',
              borderColor: '#dbe4fe'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0d0f2c';
              e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(13, 15, 44, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#dbe4fe';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => navigate(`/certification/${examCode}/exam-rush`)}
          >
            {/* Header Section */}
            <div 
              className="h-32 relative overflow-hidden"
              style={{ backgroundColor: '#fef3c7' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" 
                  style={{ backgroundColor: '#ffffff', opacity: 0.95, boxShadow: '0 4px 12px rgba(13, 15, 44, 0.15)' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: '#0d0f2c' }} />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span 
                  className="text-xs font-light px-3 py-1.5 rounded-lg uppercase tracking-wider"
                  style={{ backgroundColor: '#0d0f2c', color: '#ffffff', letterSpacing: '0.5px', fontSize: '10px' }}
                >
                  AI Mode
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-light mb-2" style={{ color: '#0d0f2c' }}>
                  AI Exam Rush
                </h2>
                <p className="text-sm font-light leading-relaxed" style={{ color: '#6b7280' }}>
                  Accelerated exam preparation powered by AI. Get personalized study paths, 
                  intelligent practice questions, and adaptive learning tailored to your exam goals.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    AI-powered personalized study plan
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Adaptive practice questions
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Smart focus on weak areas
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Play className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d0f2c' }} />
                  <span className="text-xs font-light" style={{ color: '#6b7280' }}>
                    Rapid exam readiness assessment
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full mt-4 font-light"
                variant="outline"
                style={{ borderColor: '#0d0f2c', color: '#0d0f2c' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/certification/${examCode}/exam-rush`);
                }}
              >
                Coming Soon
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

