export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          created_at: string
          created_by: string
          criteria_impact: number | null
          criteria_innovation: number | null
          criteria_sustainability: number | null
          criteria_viability: number | null
          currency: string | null
          current_participants: number | null
          description: string
          end_date: string | null
          id: string
          max_participants: number | null
          participation_fee: number | null
          prize_amount: number
          start_date: string | null
          status: Database["public"]["Enums"]["challenge_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          criteria_impact?: number | null
          criteria_innovation?: number | null
          criteria_sustainability?: number | null
          criteria_viability?: number | null
          currency?: string | null
          current_participants?: number | null
          description: string
          end_date?: string | null
          id?: string
          max_participants?: number | null
          participation_fee?: number | null
          prize_amount: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["challenge_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          criteria_impact?: number | null
          criteria_innovation?: number | null
          criteria_sustainability?: number | null
          criteria_viability?: number | null
          currency?: string | null
          current_participants?: number | null
          description?: string
          end_date?: string | null
          id?: string
          max_participants?: number | null
          participation_fee?: number | null
          prize_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["challenge_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      evaluations: {
        Row: {
          created_at: string
          evaluator_id: string
          feedback: string | null
          id: string
          impact_score: number | null
          innovation_score: number | null
          overall_score: number | null
          project_id: string
          sustainability_score: number | null
          tokens_earned: number | null
          viability_score: number | null
        }
        Insert: {
          created_at?: string
          evaluator_id: string
          feedback?: string | null
          id?: string
          impact_score?: number | null
          innovation_score?: number | null
          overall_score?: number | null
          project_id: string
          sustainability_score?: number | null
          tokens_earned?: number | null
          viability_score?: number | null
        }
        Update: {
          created_at?: string
          evaluator_id?: string
          feedback?: string | null
          id?: string
          impact_score?: number | null
          innovation_score?: number | null
          overall_score?: number | null
          project_id?: string
          sustainability_score?: number | null
          tokens_earned?: number | null
          viability_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "evaluations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_products: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          price_tnd: number | null
          price_tokens: number | null
          seller_id: string
          stock_quantity: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price_tnd?: number | null
          price_tokens?: number | null
          seller_id: string
          stock_quantity?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price_tnd?: number | null
          price_tokens?: number | null
          seller_id?: string
          stock_quantity?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge_level: Database["public"]["Enums"]["badge_level"] | null
          company_name: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          tokens_balance: number | null
          total_evaluations: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          badge_level?: Database["public"]["Enums"]["badge_level"] | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          tokens_balance?: number | null
          total_evaluations?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          badge_level?: Database["public"]["Enums"]["badge_level"] | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          tokens_balance?: number | null
          total_evaluations?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          average_rating: number | null
          budget: number | null
          challenge_id: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          is_winner: boolean | null
          media_urls: string[] | null
          objectives: string | null
          sector: string
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
          total_evaluations: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          budget?: number | null
          challenge_id?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          is_winner?: boolean | null
          media_urls?: string[] | null
          objectives?: string | null
          sector: string
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
          total_evaluations?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          budget?: number | null
          challenge_id?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          is_winner?: boolean | null
          media_urls?: string[] | null
          objectives?: string | null
          sector?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
          total_evaluations?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      badge_level: "bronze" | "silver" | "gold" | "platinum"
      challenge_status:
        | "draft"
        | "pending_approval"
        | "active"
        | "completed"
        | "cancelled"
      project_status:
        | "draft"
        | "submitted"
        | "under_evaluation"
        | "winner"
        | "rejected"
      user_role: "investor" | "projectHolder" | "evaluator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_level: ["bronze", "silver", "gold", "platinum"],
      challenge_status: [
        "draft",
        "pending_approval",
        "active",
        "completed",
        "cancelled",
      ],
      project_status: [
        "draft",
        "submitted",
        "under_evaluation",
        "winner",
        "rejected",
      ],
      user_role: ["investor", "projectHolder", "evaluator"],
    },
  },
} as const
