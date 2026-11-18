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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      club_members: {
        Row: {
          approved: boolean
          club_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          club_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          club_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          available_strings: string
          brand_color: string
          contact_email: string
          created_at: string
          currency: string
          default_price: number
          default_unit: string
          description: string
          id: string
          logo_url: string
          website: string
          welcome_message: string
          name: string
          owner_id: string
          slug: string
        }
        Insert: {
          available_strings?: string
          brand_color?: string
          contact_email?: string
          created_at?: string
          currency?: string
          default_price?: number
          default_unit?: string
          description?: string
          id?: string
          logo_url?: string
          website?: string
          welcome_message?: string
          name: string
          owner_id: string
          slug: string
        }
        Update: {
          available_strings?: string
          brand_color?: string
          contact_email?: string
          created_at?: string
          currency?: string
          default_price?: number
          default_unit?: string
          description?: string
          id?: string
          logo_url?: string
          website?: string
          welcome_message?: string
          name?: string
          owner_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          amount: number
          club_id: string
          created_at: string | null
          crosses_string: string | null
          crosses_tension: number
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          date_in: string
          head_size: number | null
          id: string
          job_number: string
          knots: number | null
          mains_string: string
          mains_tension: number
          notes: string | null
          pattern: string | null
          payment_method: string | null
          payment_status: string
          pre_stretch: string | null
          racket: string
          ready_by: string | null
          status: string
          unit: string
        }
        Insert: {
          amount?: number
          club_id: string
          created_at?: string | null
          crosses_string?: string | null
          crosses_tension: number
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          date_in?: string
          head_size?: number | null
          id?: string
          job_number?: string
          knots?: number | null
          mains_string: string
          mains_tension: number
          notes?: string | null
          pattern?: string | null
          payment_method?: string | null
          payment_status?: string
          pre_stretch?: string | null
          racket: string
          ready_by?: string | null
          status?: string
          unit?: string
        }
        Update: {
          amount?: number
          club_id?: string
          created_at?: string | null
          crosses_string?: string | null
          crosses_tension?: number
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          date_in?: string
          head_size?: number | null
          id?: string
          job_number?: string
          knots?: number | null
          mains_string?: string
          mains_tension?: number
          notes?: string | null
          pattern?: string | null
          payment_method?: string | null
          payment_status?: string
          pre_stretch?: string | null
          racket?: string
          ready_by?: string | null
          status?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          email: string
          id: string
          name: string
          original_user_id: string | null
          phone: string
          pickup_code: string
        }
        Insert: {
          avatar_path?: string | null
          email?: string
          id: string
          name?: string
          original_user_id?: string | null
          phone?: string
          pickup_code?: string
        }
        Update: {
          avatar_path?: string | null
          email?: string
          id?: string
          name?: string
          original_user_id?: string | null
          phone?: string
          pickup_code?: string
        }
        Relationships: []
      }
      rackets: {
        Row: {
          created_at: string
          crosses_string: string
          crosses_tension: number
          head_size: number
          id: string
          mains_string: string
          mains_tension: number
          name: string
          notes: string
          pattern: string
          unit: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crosses_string?: string
          crosses_tension?: number
          head_size?: number
          id?: string
          mains_string?: string
          mains_tension?: number
          name: string
          notes?: string
          pattern?: string
          unit?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crosses_string?: string
          crosses_tension?: number
          head_size?: number
          id?: string
          mains_string?: string
          mains_tension?: number
          name?: string
          notes?: string
          pattern?: string
          unit?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rackets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      racqr_account_stringer: { Args: never; Returns: boolean }
      racqr_admin: { Args: { c: string }; Returns: boolean }
      racqr_can_view_profile: { Args: { p: string }; Returns: boolean }
      racqr_choose_account: { Args: { account_type: string }; Returns: string }
      racqr_join_club: {
        Args: { club_slug: string; requested_role?: string }
        Returns: string
      }
      racqr_member: { Args: { c: string }; Returns: boolean }
      racqr_staff: { Args: { c: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
