export type AgentType = 'claude' | 'codex' | 'gemini' | 'universal';

export interface Skill {
  id: string;
  name: string;
  description: string;
  owner: string;
  repo: string;
  repoUrl: string;
  skillPath: string;
  agentTypes: AgentType[];
  stars: number;
  forks: number;
  installs: number;
  lastUpdated: string;
  language?: string;
  topics: string[];
  category?: string;
  skillMdContent?: string;
  hasScripts: boolean;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface SkillSearchResult {
  skills: Skill[];
  totalCount: number;
  page: number;
  perPage: number;
}

export interface TrendingData {
  skill: Skill;
  delta: number; // change in stars/installs in 24h
  rank: number;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
  icon: string;
}

export interface AgentConfig {
  type: AgentType;
  label: string;
  color: string;
  icon: string;
  configPath: string;
  skillsPath: string;
  description: string;
}

export interface GitHubSearchItem {
  name: string;
  path: string;
  sha: string;
  url: string;
  html_url: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    updated_at: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchItem[];
}

export interface StatsOverview {
  totalSkills: number;
  totalAgents: number;
  totalInstalls: number;
  totalRepos: number;
}
