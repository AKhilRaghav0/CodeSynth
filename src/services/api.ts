import axios from 'axios';

interface CodeforcesSubmission {
  id: number;
  contestId: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    tags: string[];
  };
  verdict: string;
}

interface AtCoderSubmission {
  id: number;
  epoch_second: number;
  problem_id: string;
  contest_id: string;
  user_id: string;
  language: string;
  point: number;
  length: number;
  result: string;
  execution_time: number;
}

export const getCodeforcesSubmissions = async (handle: string) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    return response.data.result as CodeforcesSubmission[];
  } catch (error) {
    console.error('Error fetching Codeforces submissions:', error);
    throw error;
  }
};

export const getAtCoderSubmissions = async (username: string) => {
  try {
    const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}`);
    return response.data as AtCoderSubmission[];
  } catch (error) {
    console.error('Error fetching AtCoder submissions:', error);
    throw error;
  }
};

export const getCodeforcesUserInfo = async (handle: string) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    return response.data.result[0];
  } catch (error) {
    console.error('Error fetching Codeforces user info:', error);
    throw error;
  }
};

export const getAtCoderUserInfo = async (username: string) => {
  try {
    const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user_info?user=${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AtCoder user info:', error);
    throw error;
  }
}; 