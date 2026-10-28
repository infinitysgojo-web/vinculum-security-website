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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      medium_articles: {
        Row: {
          author: string | null
          categories: string[] | null
          cover_image: string | null
          excerpt: string | null
          fetched_at: string
          id: string
          link: string
          pub_date: string
          title: string
        }
        Insert: {
          author?: string | null
          categories?: string[] | null
          cover_image?: string | null
          excerpt?: string | null
          fetched_at?: string
          id: string
          link: string
          pub_date: string
          title: string
        }
        Update: {
          author?: string | null
          categories?: string[] | null
          cover_image?: string | null
          excerpt?: string | null
          fetched_at?: string
          id?: string
          link?: string
          pub_date?: string
          title?: string
        }
        Relationships: []
      }
      medium_sync_runs: {
        Row: {
          article_count: number
          id: string
          run_at: string
          status: string
        }
        Insert: {
          article_count?: number
          id?: string
          run_at?: string
          status: string
        }
        Update: {
          article_count?: number
          id?: string
          run_at?: string
          status?: string
        }
        Relationships: []
      }
      sovereign_hazards: {
        Row: {
          alert_level: string | null
          category: string
          fetched_at: string
          id: string
          kind: string
          lat: number
          lon: number
          magnitude: number | null
          occurred_at: string | null
          source: string
          title: string
          url: string
        }
        Insert: {
          alert_level?: string | null
          category: string
          fetched_at?: string
          id: string
          kind: string
          lat: number
          lon: number
          magnitude?: number | null
          occurred_at?: string | null
          source: string
          title: string
          url: string
        }
        Update: {
          alert_level?: string | null
          category?: string
          fetched_at?: string
          id?: string
          kind?: string
          lat?: number
          lon?: number
          magnitude?: number | null
          occurred_at?: string | null
          source?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      sovereign_intelligence: {
        Row: {
          category: string
          country_codes: string[]
          created_at: string
          id: string
          published_at: string | null
          source: string
          summary: string | null
          title: string
          url: string
        }
        Insert: {
          category: string
          country_codes?: string[]
          created_at?: string
          id?: string
          published_at?: string | null
          source: string
          summary?: string | null
          title: string
          url: string
        }
        Update: {
          category?: string
          country_codes?: string[]
          created_at?: string
          id?: string
          published_at?: string | null
          source?: string
          summary?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      sovereign_maritime_incidents: {
        Row: {
          fetched_at: string
          id: string
          incident_type: string
          lat: number | null
          lon: number | null
          number: string
          occurred_at: string | null
          place: string
          region: string | null
          reported_at: string | null
          source: string
          summary: string
          type_level: number | null
          url: string
          vessel_type: string | null
        }
        Insert: {
          fetched_at?: string
          id: string
          incident_type: string
          lat?: number | null
          lon?: number | null
          number: string
          occurred_at?: string | null
          place: string
          region?: string | null
          reported_at?: string | null
          source: string
          summary: string
          type_level?: number | null
          url: string
          vessel_type?: string | null
        }
        Update: {
          fetched_at?: string
          id?: string
          incident_type?: string
          lat?: number | null
          lon?: number | null
          number?: string
          occurred_at?: string | null
          place?: string
          region?: string | null
          reported_at?: string | null
          source?: string
          summary?: string
          type_level?: number | null
          url?: string
          vessel_type?: string | null
        }
        Relationships: []
      }
      sovereign_movement_daily: {
        Row: {
          day: string
          max: number
          metric: string
          samples: number
          strait_key: string
          total: number
        }
        Insert: {
          day: string
          max?: number
          metric: string
          samples?: number
          strait_key: string
          total?: number
        }
        Update: {
          day?: string
          max?: number
          metric?: string
          samples?: number
          strait_key?: string
          total?: number
        }
        Relationships: []
      }
      sovereign_movement_latest: {
        Row: {
          detail: Json | null
          metric: string
          previous_at: string | null
          previous_value: number | null
          sampled_at: string
          source: string
          strait_key: string
          value: number
          window_seconds: number | null
        }
        Insert: {
          detail?: Json | null
          metric: string
          previous_at?: string | null
          previous_value?: number | null
          sampled_at?: string
          source: string
          strait_key: string
          value: number
          window_seconds?: number | null
        }
        Update: {
          detail?: Json | null
          metric?: string
          previous_at?: string | null
          previous_value?: number | null
          sampled_at?: string
          source?: string
          strait_key?: string
          value?: number
          window_seconds?: number | null
        }
        Relationships: []
      }
      sovereign_source_status: {
        Row: {
          attempted_at: string
          item_count: number
          last_ok_at: string | null
          source: string
          status: string
          task: string
        }
        Insert: {
          attempted_at?: string
          item_count?: number
          last_ok_at?: string | null
          source: string
          status: string
          task: string
        }
        Update: {
          attempted_at?: string
          item_count?: number
          last_ok_at?: string | null
          source?: string
          status?: string
          task?: string
        }
        Relationships: []
      }
      sovereign_sync_runs: {
        Row: {
          id: string
          inserted_count: number
          run_at: string
          status: string
          task: string
        }
        Insert: {
          id?: string
          inserted_count?: number
          run_at?: string
          status: string
          task?: string
        }
        Update: {
          id?: string
          inserted_count?: number
          run_at?: string
          status?: string
          task?: string
        }
        Relationships: []
      }
      sovereign_un_sanctions: {
        Row: {
          fetched_at: string
          id: string
          kind: string
          list_generated_at: string | null
          listed_on: string | null
          name: string
          reference_number: string
          regime: string
          regime_iso3: string | null
        }
        Insert: {
          fetched_at?: string
          id: string
          kind: string
          list_generated_at?: string | null
          listed_on?: string | null
          name: string
          reference_number: string
          regime: string
          regime_iso3?: string | null
        }
        Update: {
          fetched_at?: string
          id?: string
          kind?: string
          list_generated_at?: string | null
          listed_on?: string | null
          name?: string
          reference_number?: string
          regime?: string
          regime_iso3?: string | null
        }
        Relationships: []
      }
      sovereign_warnings: {
        Row: {
          area: string
          fetched_at: string
          id: string
          issued_at: string | null
          kind: string
          number: string
          points: Json
          source: string
          text: string
          title: string
          url: string
        }
        Insert: {
          area: string
          fetched_at?: string
          id: string
          issued_at?: string | null
          kind: string
          number: string
          points: Json
          source: string
          text: string
          title: string
          url: string
        }
        Update: {
          area?: string
          fetched_at?: string
          id?: string
          issued_at?: string | null
          kind?: string
          number?: string
          points?: Json
          source?: string
          text?: string
          title?: string
          url?: string
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
