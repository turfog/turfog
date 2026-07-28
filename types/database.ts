/**
 * Supabase Database Type Definitions
 * Auto-generated types for type-safe database operations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          auth_id: string;
          full_name: string;
          username: string | null;
          username_set: boolean;
          bio: string;
          phone: string;
          city: string;
          profile_photo: string;
          cover_photo: string;
          verification_status: string;
          is_online: boolean;
          last_active: string;
          total_matches: number;
          total_wins: number;
          total_mvps: number;
          reliability_score: number;
          xp_points: number;
          level: number;
          streak: number;
          admin_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          full_name?: string;
          username?: string | null;
          username_set?: boolean;
          bio?: string;
          phone?: string;
          city?: string;
          profile_photo?: string;
          cover_photo?: string;
          verification_status?: string;
          is_online?: boolean;
          last_active?: string;
          total_matches?: number;
          total_wins?: number;
          total_mvps?: number;
          reliability_score?: number;
          xp_points?: number;
          level?: number;
          streak?: number;
          admin_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          full_name?: string;
          username?: string | null;
          username_set?: boolean;
          bio?: string;
          phone?: string;
          city?: string;
          profile_photo?: string;
          cover_photo?: string;
          verification_status?: string;
          is_online?: boolean;
          last_active?: string;
          total_matches?: number;
          total_wins?: number;
          total_mvps?: number;
          reliability_score?: number;
          xp_points?: number;
          level?: number;
          streak?: number;
          admin_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "players_auth_id_fkey";
            columns: ["auth_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/**
 * Helper type for the players table row
 */
export type Player = Database["public"]["Tables"]["players"]["Row"];

/**
 * Helper type for creating a new player
 */
export type PlayerInsert = Database["public"]["Tables"]["players"]["Insert"];

/**
 * Helper type for updating a player
 */
export type PlayerUpdate = Database["public"]["Tables"]["players"]["Update"];