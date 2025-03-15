// Types for problem recommendations
interface ProblemRecommendation {
  platform: string;
  problemId: string;
  name: string;
  difficulty: string;
  tags: string[];
  url: string;
  reason: string;
}

/**
 * Get problem recommendations based on solved problems
 */
export async function getRecommendations(
  solvedProblems: any[],
  platform: string,
  preferredTags?: string[]
): Promise<ProblemRecommendation[]> {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        solvedProblems,
        platform,
        preferredTags,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get recommendations');
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    throw new Error(error?.message || 'Failed to get recommendations');
  }
} 