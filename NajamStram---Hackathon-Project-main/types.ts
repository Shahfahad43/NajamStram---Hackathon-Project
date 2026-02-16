import React from 'react';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  group: string;
  status: 'Upcoming' | 'Live' | 'Finished';
  homeScore?: number;
  awayScore?: number;
  homeVotes?: number;
  awayVotes?: number;
  userVoted?: 'home' | 'away' | null;
}

export interface Stream {
  id: string;
  title: string;
  streamerName: string;
  viewers: number;
  thumbnailUrl: string;
  tags: string[];
  isLive: boolean;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'viewer' | 'creator';
  email: string;
  avatar?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}