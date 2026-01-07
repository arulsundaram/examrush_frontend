import { ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface BreadcrumbItem {
  code?: string;
  title: string;
}

interface TutorPageLayoutProps {
  breadcrumb: {
    exam: BreadcrumbItem;
    domain: BreadcrumbItem | null;
    objective: BreadcrumbItem | null;
    topic: BreadcrumbItem;
  };
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export function TutorPageLayout({
  breadcrumb,
  leftContent,
  rightContent,
}: TutorPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link 
            to="/catalog" 
            className="hover:text-foreground flex items-center gap-1 transition-colors font-medium"
          >
            <Home className="h-4 w-4" />
            Catalog
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          <span className="text-foreground font-semibold">{breadcrumb.exam.code}</span>
          {breadcrumb.domain && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-foreground/80">{breadcrumb.domain.title}</span>
            </>
          )}
          {breadcrumb.objective && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-foreground/80">{breadcrumb.objective.title}</span>
            </>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          <span className="text-foreground font-semibold">{breadcrumb.topic.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Left Workspace */}
        <div className="flex-1 space-y-6 min-w-0">{leftContent}</div>

        {/* Right Coach Panel */}
        <aside className="w-80 flex-shrink-0">
          <div className="sticky top-6">{rightContent}</div>
        </aside>
      </div>
    </div>
  );
}

