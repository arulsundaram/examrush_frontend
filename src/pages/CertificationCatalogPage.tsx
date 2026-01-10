import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Search, X, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

// Certification categories based on Microsoft Learn structure
const certificationCategories = [
  { id: 'fundamentals', label: 'Fundamentals', color: 'bg-blue-100 text-blue-800' },
  { id: 'associate', label: 'Associate', color: 'bg-green-100 text-green-800' },
  { id: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-800' },
  { id: 'specialty', label: 'Specialty', color: 'bg-orange-100 text-orange-800' },
];


// Map exam codes to categories
const getExamCategory = (code: string): string => {
  if (code.includes('900')) return 'fundamentals';
  if (code.includes('102') || code.includes('104') || code.includes('204')) return 'associate';
  if (code.includes('305') || code.includes('400')) return 'expert';
  return 'specialty';
};

export function CertificationCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCredentialTypes, setSelectedCredentialTypes] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: examsData, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => api.getExams(),
  });

  const exams = examsData?.exams || [];

  // Extract all unique products and roles from exams
  const allProducts = useMemo(() => {
    const products = new Set<string>();
    exams.forEach((exam: any) => {
      if (exam.product) {
        exam.product.forEach((p: string) => products.add(p));
      }
    });
    return Array.from(products).sort();
  }, [exams]);

  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    exams.forEach((exam: any) => {
      if (exam.role) {
        exam.role.forEach((r: string) => roles.add(r));
      }
    });
    return Array.from(roles).sort();
  }, [exams]);

  const allCredentialTypes = useMemo(() => {
    const types = new Set<string>();
    exams.forEach((exam: any) => {
      if (exam.credentialType) {
        types.add(exam.credentialType);
      } else {
        types.add('Certification'); // Default
      }
    });
    return Array.from(types).sort();
  }, [exams]);

  // Filter exams based on search, category, products, roles, and credential types

  // Filter exams based on search, category, products, and roles
  const filteredExams = exams.filter((exam: any) => {
    const matchesSearch =
      exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.skills?.some((skill: string) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory =
      selectedCategory === 'all' || exam.category === selectedCategory || getExamCategory(exam.code) === selectedCategory;

    const matchesProducts =
      selectedProducts.length === 0 ||
      selectedProducts.some((product) => exam.product?.includes(product));

    const matchesRoles =
      selectedRoles.length === 0 ||
      selectedRoles.some((role) => exam.role?.includes(role));

    const matchesCredentialType =
      selectedCredentialTypes.length === 0 ||
      selectedCredentialTypes.includes(exam.credentialType || 'Certification');

    return matchesSearch && matchesCategory && matchesProducts && matchesRoles && matchesCredentialType;
  });


    return (
    <div className="h-full" style={{ backgroundColor: '#f5f6f8' }}>
    <div className="h-full flex flex-col p-6 space-y-6">

      {/* Main Layout: Sidebar + Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } flex-shrink-0 transition-all duration-300 overflow-hidden ${
            sidebarOpen ? 'border-r' : ''
          }`}
          style={sidebarOpen ? { borderColor: '#dbe4fe', backgroundColor: '#dee5fc' } : {}}
        >
          <div 
            className={`sticky top-6 space-y-5 p-5 rounded-xl ${sidebarOpen ? '' : 'hidden'}`}
            style={{ backgroundColor: '#dee5fc' }}
          >
            {/* Level Filter */}
            <div>
              <h3 className="text-xs font-light mb-2.5 uppercase tracking-wider" style={{ color: '#0d0f2c', letterSpacing: '0.5px' }}>Level</h3>
              <div className="space-y-1">
                <label className="flex items-center space-x-2.5 cursor-pointer p-1.5 rounded-lg transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbe4fe'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <input
                    type="radio"
                    name="level"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="rounded"
                    style={{ accentColor: '#0d0f2c', width: '14px', height: '14px' }}
                  />
                  <span className="text-xs font-light" style={{ color: '#0d0f2c', fontSize: '12px' }}>All Levels</span>
                </label>
                {certificationCategories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2.5 cursor-pointer p-1.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbe4fe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="rounded"
                      style={{ accentColor: '#0d0f2c', width: '14px', height: '14px' }}
                    />
                    <span className="text-xs font-light" style={{ color: '#0d0f2c', fontSize: '12px' }}>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Filters */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-light uppercase tracking-wider" style={{ color: '#0d0f2c', letterSpacing: '0.5px' }}>Product</h3>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="text-xs font-light hover:opacity-70 transition-opacity"
                    style={{ color: '#a4abc3', fontSize: '11px' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {allProducts.map((product) => (
                  <label
                    key={product}
                    className="flex items-center space-x-2.5 cursor-pointer p-1.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbe4fe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product)}
                      onChange={() => {
                        setSelectedProducts((prev) =>
                          prev.includes(product)
                            ? prev.filter((p) => p !== product)
                            : [...prev, product]
                        );
                      }}
                      className="rounded"
                      style={{ accentColor: '#0d0f2c', width: '14px', height: '14px' }}
                    />
                    <span className="text-xs font-light flex-1" style={{ color: '#0d0f2c', fontSize: '12px' }}>{product}</span>
                    {selectedProducts.includes(product) && (
                      <X className="h-3 w-3" style={{ color: '#a4abc3' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Role Filters */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-light uppercase tracking-wider" style={{ color: '#0d0f2c', letterSpacing: '0.5px' }}>Role</h3>
                {selectedRoles.length > 0 && (
                  <button
                    onClick={() => setSelectedRoles([])}
                    className="text-xs font-light hover:opacity-70 transition-opacity"
                    style={{ color: '#a4abc3', fontSize: '11px' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {allRoles.map((role) => (
                  <label
                    key={role}
                    className="flex items-center space-x-2.5 cursor-pointer p-1.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbe4fe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => {
                        setSelectedRoles((prev) =>
                          prev.includes(role)
                            ? prev.filter((r) => r !== role)
                            : [...prev, role]
                        );
                      }}
                      className="rounded"
                      style={{ accentColor: '#0d0f2c', width: '14px', height: '14px' }}
                    />
                    <span className="text-xs font-light flex-1" style={{ color: '#0d0f2c', fontSize: '12px' }}>{role}</span>
                    {selectedRoles.includes(role) && (
                      <X className="h-3 w-3" style={{ color: '#a4abc3' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Credential Type Filters */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-light uppercase tracking-wider" style={{ color: '#0d0f2c', letterSpacing: '0.5px' }}>Credential Types</h3>
                {selectedCredentialTypes.length > 0 && (
                  <button
                    onClick={() => setSelectedCredentialTypes([])}
                    className="text-xs font-light hover:opacity-70 transition-opacity"
                    style={{ color: '#a4abc3', fontSize: '11px' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {allCredentialTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center space-x-2.5 cursor-pointer p-1.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbe4fe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCredentialTypes.includes(type)}
                      onChange={() => {
                        setSelectedCredentialTypes((prev) =>
                          prev.includes(type)
                            ? prev.filter((t) => t !== type)
                            : [...prev, type]
                        );
                      }}
                      className="rounded"
                      style={{ accentColor: '#0d0f2c', width: '14px', height: '14px' }}
                    />
                    <span className="text-xs font-light flex-1" style={{ color: '#0d0f2c', fontSize: '12px' }}>{type}</span>
                    {selectedCredentialTypes.includes(type) && (
                      <X className="h-3 w-3" style={{ color: '#a4abc3' }} />
                    )}
                  </label>
                ))}
        </div>
      </div>

            {/* Clear All Filters */}
            {(selectedProducts.length > 0 || selectedRoles.length > 0 || selectedCredentialTypes.length > 0 || selectedCategory !== 'all') && (
              <button
                className="w-full py-2 px-3 rounded-lg text-xs font-light transition-colors"
                onClick={() => {
                  setSelectedProducts([]);
                  setSelectedRoles([]);
                  setSelectedCredentialTypes([]);
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                style={{ 
                  border: '1px solid #dbe4fe',
                  color: '#0d0f2c',
                  backgroundColor: 'transparent',
                  fontSize: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbe4fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Sidebar Toggle Button */}
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="sticky top-6 h-10 w-10 shadow-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse filters' : 'Expand filters'}
            style={{ 
              borderColor: '#dbe4fe',
              backgroundColor: '#ffffff',
              color: '#0d0f2c'
            }}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Search Bar and Results Header */}
          <div className="flex items-center justify-between gap-4 pb-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#a4abc3' }} />
            <Input
              type="search"
                placeholder="Search videos, topics, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-background border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
            <div className="text-sm whitespace-nowrap" style={{ color: '#a4abc3' }}>
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  Showing <span className="font-semibold" style={{ color: '#0d0f2c' }}>{filteredExams.length}</span> of{' '}
                  <span className="font-semibold" style={{ color: '#0d0f2c' }}>{exams.length}</span> certifications
                </>
              )}
        </div>
      </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#0d0f2c', borderTopColor: 'transparent' }}></div>
              <p style={{ color: '#a4abc3' }}>Loading certifications...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredExams.length === 0 && (
            <div className="rounded-lg p-12 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #dbe4fe' }}>
              <p style={{ color: '#0d0f2c' }}>No certifications found</p>
              <p className="text-sm mt-2" style={{ color: '#a4abc3' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Certifications Grid */}
          {!isLoading && filteredExams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExams.map((exam) => (
                <CertificationCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

interface CertificationCardProps {
  exam: {
    id: string;
    code: string;
    title: string;
    description?: string;
    category?: string;
    level?: string;
    requiredExams?: string[];
    skills?: string[];
    product?: string[];
    role?: string[];
    credentialType?: string;
    hasContent?: boolean;
    domains?: Array<{
      id: string;
      code: string;
      title: string;
      objectives: Array<{ id: string }>;
    }>;
    topicCount: number;
  };
  compact?: boolean;
}

function CertificationCard({ exam, compact = false }: CertificationCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/certification/${exam.code}/modes`);
  };

  if (compact) {
            return (
              <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
        onClick={handleClick}
              >
                <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2">{exam.code}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                        {exam.title}
                      </CardDescription>
                    </div>
            <Award className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
        <CardContent>
                    <Button
            variant="outline"
                      size="sm"
            className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
              handleClick();
                      }}
                    >
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </CardContent>
              </Card>
            );
  }

  // Map level to Microsoft Learn format
  const getLevelLabel = (level?: string): string => {
    if (!level) return '';
    if (level.toLowerCase().includes('fundamentals')) return 'Beginner';
    if (level.toLowerCase().includes('associate')) return 'Intermediate';
    if (level.toLowerCase().includes('expert')) return 'Advanced';
    return level;
  };

  const levelLabel = getLevelLabel(exam.level);

  return (
    <article
      className="cursor-pointer border overflow-hidden hover:shadow-xl transition-all duration-300 group"
      onClick={handleClick}
      style={{ 
        backgroundColor: '#ffffff',
        borderColor: '#dbe4fe',
        borderRadius: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0d0f2c';
        e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(13, 15, 44, 0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#dbe4fe';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Video Thumbnail Placeholder */}
      <div 
        className="w-full h-36 relative overflow-hidden"
        style={{ backgroundColor: '#dee5fc', borderRadius: '12px 12px 0 0' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" 
            style={{ backgroundColor: '#ffffff', opacity: 0.95, boxShadow: '0 4px 12px rgba(13, 15, 44, 0.15)' }}
          >
            <svg className="w-7 h-7 ml-0.5" style={{ color: '#0d0f2c' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Exam Code Badge */}
        <div className="absolute top-3 left-3">
          <span 
            className="text-xs font-light px-2.5 py-1.5 rounded-lg uppercase tracking-wider"
            style={{ backgroundColor: '#0d0f2c', color: '#ffffff', letterSpacing: '0.5px', fontSize: '10px' }}
          >
            {exam.code}
          </span>
        </div>
        {/* Credential Type Badge */}
        <div className="absolute top-3 right-3">
          <span 
            className="text-xs font-light px-2.5 py-1.5 rounded-lg uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#4b5563', letterSpacing: '0.5px', fontSize: '10px', backdropFilter: 'blur(4px)' }}
          >
            {exam.credentialType || 'Certification'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-sm font-light mb-3 transition-colors leading-snug" style={{ color: '#0d0f2c', lineHeight: '1.4' }}>
          {exam.title}
        </h3>

        {/* Tags: Product, Role, Level */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-light" style={{ color: '#6b7280' }}>
        {/* Products */}
        {exam.product && exam.product.length > 0 && (
          <>
            {exam.product.slice(0, 2).map((product, idx) => (
              <span key={idx}>
                {product}
                {idx < Math.min(exam.product!.length, 2) - 1 && ' •'}
              </span>
            ))}
            {exam.product.length > 2 && (
              <span>
                +{exam.product.length - 2} more •
              </span>
            )}
          </>
        )}
        
        {/* Roles */}
        {exam.role && exam.role.length > 0 && (
          <>
            {exam.product && exam.product.length > 0 && ' • '}
            {exam.role.slice(0, 1).map((role, idx) => (
              <span key={idx}>
                {role}
              </span>
            ))}
            {exam.role.length > 1 && (
              <span>
                {' • '}+{exam.role.length - 1} more
              </span>
            )}
          </>
        )}

        {/* Level */}
        {levelLabel && (
          <>
            {(exam.product && exam.product.length > 0) || (exam.role && exam.role.length > 0) ? ' • ' : ''}
            <span>{levelLabel}</span>
          </>
      )}
    </div>
      </div>
    </article>
  );
}
