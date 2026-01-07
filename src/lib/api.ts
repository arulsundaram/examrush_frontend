const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiError {
  error: string;
  details?: unknown;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'An error occurred',
    }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; name: string }) =>
    request<{ user: unknown; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<{ user: unknown }>('/auth/me'),

  // Videos
  getVideos: (params?: {
    query?: string;
    tag?: string;
    level?: string;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.level) searchParams.set('level', params.level);
    if (params?.sort) searchParams.set('sort', params.sort);
    const queryString = searchParams.toString();
    return request<{ videos: unknown[] }>(
      `/videos${queryString ? `?${queryString}` : ''}`
    );
  },

  getVideo: (id: string) =>
    request<{
      id: string;
      title: string;
      description: string;
      durationSeconds: number;
      level: string;
      tags: string[];
      thumbnailUrl?: string;
      videoUrl?: string;
      createdAt: string;
      topicCount: number;
    }>(`/videos/${id}`),

  // Topics
  getTopics: (videoId: string) =>
    request<{ topics: unknown[] }>(`/videos/${videoId}/topics`),

  searchClips: (videoId: string, prompt: string) =>
    request<{
      prompt: string;
      bestMatch: {
        topicId: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
        confidence: 'High' | 'Medium' | 'Low';
        transcriptExcerpt: string;
      };
      related: Array<{
        topicId: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
        confidence: 'High' | 'Medium' | 'Low';
        transcriptExcerpt: string;
      }>;
      allTopics: Array<{
        topicId: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
        keywords: string[];
      }>;
    }>(`/videos/${videoId}/clip-search`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),

  // Progress
  updateProgress: (data: {
    videoId: string;
    progressPercent: number;
    lastPositionSeconds: number;
  }) => request<{ progress: unknown }>('/progress', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Achievements
  getAchievements: () =>
    request<{
      xp: number;
      streakCount: number;
      recentProgress: Array<{
        videoId: string;
        videoTitle: string;
        thumbnailUrl?: string;
        progressPercent: number;
        lastPositionSeconds: number;
        updatedAt: string;
      }>;
    }>('/achievements'),

  // Tutor Mode
  getTutorData: (code: string, topicId: string) =>
    request<{
      topic: {
        id: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
        transcriptExcerpt: string;
        keywords: string[];
        difficulty?: string;
        examAngleNotes?: string;
      };
      video: {
        id: string;
        title: string;
        videoUrl?: string;
        thumbnailUrl?: string;
      };
      blueprintContext: {
        domain: { code: string; title: string } | null;
        objective: { code: string; title: string } | null;
        skills: string[];
      };
      mastery: Record<
        string,
        {
          masteryScore: number;
          confidence: string;
          lastAssessedAt: Date | null;
        }
      > | null;
      keyConcepts: string[];
      highlights: string[];
      techTags: string[];
      relatedTopicsSameVideo: Array<{
        id: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
      }>;
      labs: Array<{
        labId: string;
        title: string;
        steps: any[];
        checklist: string[];
        tags: string[];
      }>;
      microDrill: {
        drillId: string;
        questions: Array<{
          id: string;
          questionText: string;
          options: Array<{ id: string; text: string }>;
        }>;
      } | null;
      relevantVideos: Array<{
        id: string;
        title: string;
        description: string;
        thumbnailUrl?: string;
        durationSeconds: number;
        level: string;
        tags: string[];
        topicCount: number;
      }>;
    }>(`/exams/${code}/topics/${topicId}/tutor`),

  promptTopicClip: (topicId: string, prompt: string) =>
    request<{
      prompt: string;
      bestMatch: {
        topicId: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
        confidence: 'High' | 'Medium' | 'Low';
        transcriptExcerpt: string;
      } | null;
      related: Array<{
        topicId: string;
        title: string;
        startSeconds: number;
        endSeconds: number;
        confidence: 'High' | 'Medium' | 'Low';
        transcriptExcerpt: string;
      }>;
      mappedSkills: string[];
    }>(`/topics/${topicId}/prompt-clip`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),

  completeLab: (labId: string, topicId: string) =>
    request<{ completion: unknown }>(`/labs/${labId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ topicId }),
    }),

  // Exams
  getExams: () =>
    request<{
      exams: Array<{
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
        domains: Array<{
          id: string;
          code: string;
          title: string;
          description?: string;
          objectives: Array<{
            id: string;
            code: string;
            title: string;
            description?: string;
            skillIds: string[];
            topicCount: number;
          }>;
        }>;
        topicCount: number;
      }>;
    }>('/exams'),

  getExam: (code: string) =>
    request<{
      exam: {
        id: string;
        code: string;
        title: string;
        description?: string;
        domains: Array<{
          id: string;
          code: string;
          title: string;
          description?: string;
          objectives: Array<{
            id: string;
            code: string;
            title: string;
            description?: string;
            skillIds: string[];
            topics: Array<{
              id: string;
              title: string;
              startSeconds?: number;
              endSeconds?: number;
              techTags?: string[];
              keyConcepts?: any[];
              video: {
                id: string;
                title: string;
                description?: string;
                thumbnailUrl?: string;
                durationSeconds: number;
                level?: string;
              };
            }>;
          }>;
        }>;
        topicCount: number;
        allTopics?: Array<{
          id: string;
          title: string;
          video: any;
          objective: any;
          domain: any;
        }>;
        videosByTechTags?: Array<{
          tag: string;
          videos: Array<{
            topicId: string;
            topicTitle: string;
            video: any;
          }>;
        }>;
        videosByConcepts?: Array<{
          concept: string;
          videos: Array<{
            topicId: string;
            topicTitle: string;
            video: any;
          }>;
        }>;
        demoVideos?: Array<{
          id: string;
          title: string;
          description?: string;
          thumbnailUrl?: string;
          durationSeconds: number;
          level?: string;
          tags?: string[];
          topics?: Array<{
            id: string;
            title: string;
            startSeconds: number;
            endSeconds: number;
          }>;
        }>;
        totalVideos?: number;
        totalTopics?: number;
      };
    }>(`/exams/${code}`),
};

