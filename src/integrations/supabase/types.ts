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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      community_gardens: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          external_link: string | null
          hidden: boolean | null
          id: string
          image_url: string | null
          name: string
          region: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          external_link?: string | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          region: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          external_link?: string | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          region?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string | null
          name: string | null
          subject: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string | null
          name?: string | null
          subject?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string | null
          name?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          course_name: string | null
          created_at: string | null
          display_order: number | null
          hidden: boolean | null
          id: string
          link: string | null
          location: string | null
          logo_url: string | null
          org_name: string
        }
        Insert: {
          course_name?: string | null
          created_at?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          link?: string | null
          location?: string | null
          logo_url?: string | null
          org_name: string
        }
        Update: {
          course_name?: string | null
          created_at?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          link?: string | null
          location?: string | null
          logo_url?: string | null
          org_name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          booking_link: string | null
          created_at: string | null
          date_display: string | null
          description: string | null
          event_date: string | null
          hidden: boolean | null
          id: string
          image_url: string | null
          location: string | null
          organiser: string | null
          slug: string
          tags: string[] | null
          time_display: string | null
          title: string
        }
        Insert: {
          address?: string | null
          booking_link?: string | null
          created_at?: string | null
          date_display?: string | null
          description?: string | null
          event_date?: string | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          location?: string | null
          organiser?: string | null
          slug: string
          tags?: string[] | null
          time_display?: string | null
          title: string
        }
        Update: {
          address?: string | null
          booking_link?: string | null
          created_at?: string | null
          date_display?: string | null
          description?: string | null
          event_date?: string | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          location?: string | null
          organiser?: string | null
          slug?: string
          tags?: string[] | null
          time_display?: string | null
          title?: string
        }
        Relationships: []
      }
      farms: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hidden: boolean | null
          id: string
          image_url: string | null
          name: string
          volunteering_link: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          volunteering_link?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          volunteering_link?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hidden: boolean | null
          id: string
          link: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          link?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          link?: string | null
          title?: string
        }
        Relationships: []
      }
      supported_gardening: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hidden: boolean | null
          id: string
          image_url: string | null
          link: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          name?: string
        }
        Relationships: []
      }
      surplus_projects: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hidden: boolean | null
          id: string
          image_url: string | null
          link: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          name?: string
        }
        Relationships: []
      }
      wildlife_gardening_entries: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hidden: boolean | null
          id: string
          image_url: string | null
          link: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hidden?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          title?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
