export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  bio?: string;
  sports?: string[];
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  details: string;
  sport: string;
  start_time: string;
  end_time: string;
  location: string;
  latitude: number;
  longitude: number;
  max_participants: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  host_id: string;
  created_at: string;
  updated_at: string;
}

export interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
  status: 'going' | 'not_going' | 'maybe';
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  from_user_id: string;
  to_user_id: string;
  event_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_event_id?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

export type Sport = {
  id: string;
  name: string;
  icon: string;
};

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  success: boolean;
}

// Form Data Types
export interface EventFormData {
  title: string;
  details: string;
  sport: string;
  start_time: string;
  end_time: string;
  location: string;
  latitude: number;
  longitude: number;
  max_participants: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

export interface ProfileFormData {
  full_name: string;
  bio?: string;
  sports?: string[];
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  avatar_url?: string;
}
