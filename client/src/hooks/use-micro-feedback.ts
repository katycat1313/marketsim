import { useQuery } from '@tanstack/react-query';

interface MicroFeedbackStats {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export function useMicroFeedbackStats(contentType: string, contentId?: number) {
  let queryKey = [`/api/micro-feedback/stats/${contentType}`];
  
  // Add contentId to the query key if provided
  if (contentId !== undefined) {
    queryKey.push(contentId.toString());
  }

  return useQuery<MicroFeedbackStats>({
    queryKey,
    queryFn: async () => {
      const url = new URL(`/api/micro-feedback/stats/${contentType}`, window.location.origin);
      
      if (contentId !== undefined) {
        url.searchParams.append('contentId', contentId.toString());
      }
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback stats');
      }
      
      return response.json();
    },
    // Keep cached for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}