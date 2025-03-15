import React from 'react';

interface Problem {
  platform: string;
  problemId: string;
  name: string;
  difficulty: string;
  tags: string[];
  url: string;
  reason: string;
}

interface ProblemRecommendationsProps {
  recommendations: Problem[];
  onProblemSolved: (problem: Problem) => void;
}

const ProblemRecommendations: React.FC<ProblemRecommendationsProps> = ({
  recommendations,
  onProblemSolved,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Recommended Problems</h2>
      {recommendations.map((problem, index) => (
        <div
          key={`${problem.platform}-${problem.problemId}`}
          className="card bg-base-200 shadow-xl"
        >
          <div className="card-body">
            <h3 className="card-title flex justify-between">
              <span>{problem.name}</span>
              <span className="badge badge-primary">{problem.difficulty}</span>
            </h3>
            <div className="flex flex-wrap gap-2 my-2">
              {problem.tags.map((tag) => (
                <span key={tag} className="badge badge-secondary">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm opacity-70">{problem.reason}</p>
            <div className="card-actions justify-end mt-4">
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Solve Problem
              </a>
              <button
                onClick={() => onProblemSolved(problem)}
                className="btn btn-success btn-sm"
              >
                Mark as Solved
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemRecommendations; 