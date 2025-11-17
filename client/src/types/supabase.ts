export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          sports: string[] | null
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          sports?: string[] | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          sports?: string[] | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          sport: string
          start_time: string
          end_time: string
          location: string
          latitude: number
          longitude: number
          max_participants: number
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all'
          host_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          sport: string
          start_time: string
          end_time: string
          location: string
          latitude: number
          longitude: number
          max_participants: number
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all'
          host_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          sport?: string
          start_time?: string
          end_time?: string
          location?: string
          latitude?: number
          longitude?: number
          max_participants?: number
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'all'
          host_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          id: string
          user_id: string
          event_id: string
          status: 'going' | 'not_going' | 'maybe'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          status: 'going' | 'not_going' | 'maybe'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          status?: 'going' | 'not_going' | 'maybe'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          event_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          event_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          event_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string | null
          reported_event_id: string | null
          reason: string
          status: 'pending' | 'resolved' | 'dismissed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id?: string | null
          reported_event_id?: string | null
          reason: string
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string | null
          reported_event_id?: string | null
          reason?: string
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
