import { NextResponse } from 'next/server';

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

interface ProblemRecommendation {
  platform: string;
  problemId: string;
  name: string;
  difficulty: string;
  tags: string[];
  url: string;
  reason: string;
}

export async function POST(request: Request) {
  try {
    const { solvedProblems, platform, preferredTags } = await request.json();
    
    const prompt = `As a competitive programming coach, analyze these solved problems and recommend 5 next problems to attempt. 
      Consider the user's solving patterns, preferred topics ${preferredTags ? `(${preferredTags.join(', ')})` : ''}, 
      and progression in difficulty.

      Solved Problems: ${JSON.stringify(solvedProblems)}
      Platform: ${platform}

      Format each recommendation as a JSON object with:
      - platform (string)
      - problemId (string)
      - name (string)
      - difficulty (string)
      - tags (array of strings)
      - url (string)
      - reason (string explaining why this problem is recommended)

      Return only the JSON array of recommendations.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;

    try {
      // Extract JSON from code block if present
      const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      
      const recommendations = JSON.parse(jsonText.trim()) as ProblemRecommendation[];
      return NextResponse.json({ recommendations });
    } catch (parseError) {
      console.error('Error parsing Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to parse AI recommendations' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 