'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ContributionGraph from '@/components/ContributionGraph';
import ProblemRecommendations from '@/components/ProblemRecommendations';
import { getCodeforcesSubmissions, getAtCoderSubmissions } from '@/services/api';
import { getRecommendations } from '@/services/gemini';

export default function Home() {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<'codeforces' | 'atcoder'>('codeforces');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<{ date: string; count: number; }[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmissions([]);
    setRecommendations([]);

    try {
      // Fetch submissions based on platform
      const submissionsData = platform === 'codeforces'
        ? await getCodeforcesSubmissions(username)
        : await getAtCoderSubmissions(username);

      // Process submissions for the graph
      const submissionsByDate = submissionsData.reduce((acc: { [key: string]: number }, sub: any) => {
        const date = platform === 'codeforces'
          ? new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0]
          : new Date(sub.epoch_second * 1000).toISOString().split('T')[0];
        
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const processedSubmissions = Object.entries(submissionsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setSubmissions(processedSubmissions);

      // Get AI recommendations
      const recs = await getRecommendations(submissionsData, platform);
      setRecommendations(recs);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err?.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSolved = (problem: any) => {
    setRecommendations(prev => prev.filter(p => p.problemId !== problem.problemId));
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">
            Track Your CP Progress
          </h1>
          <form onSubmit={handleSubmit} className="card bg-base-200 p-6 max-w-md mx-auto space-y-4 mb-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your handle"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Platform</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as 'codeforces' | 'atcoder')}
              >
                <option value="codeforces">Codeforces</option>
                <option value="atcoder">AtCoder</option>
              </select>
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Loading...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </form>

          {error && (
            <div className="alert alert-error mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {loading && !error && (
            <div className="flex flex-col items-center justify-center space-y-4 my-8">
              <div className="loading loading-ring loading-lg"></div>
              <p className="text-lg">Analyzing your submissions...</p>
            </div>
          )}

          {submissions.length > 0 && (
            <div className="card bg-base-200 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Submission History</h2>
              <ContributionGraph submissions={submissions} platform={platform} />
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="card bg-base-200 p-6">
              <ProblemRecommendations
                recommendations={recommendations}
                onProblemSolved={handleProblemSolved}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 