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
      campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string | null
          delivery_status: string | null
          id: string
          last_click_at: string | null
          last_open_at: string | null
          last_reply_at: string | null
          last_sent_at: string | null
          step_status: Json | null
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          last_click_at?: string | null
          last_open_at?: string | null
          last_reply_at?: string | null
          last_sent_at?: string | null
          step_status?: Json | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          last_click_at?: string | null
          last_open_at?: string | null
          last_reply_at?: string | null
          last_sent_at?: string | null
          step_status?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ai_summary: string | null
          channel: Database["public"]["Enums"]["campaign_channel"] | null
          compliance_check_passed: boolean | null
          confirmation_log: Json | null
          created_at: string | null
          daily_send_limit: number | null
          goal: string | null
          icp_id: string | null
          id: string
          research_snapshot: Json | null
          schedule_timezone: string | null
          start_datetime: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          title: string
          updated_at: string | null
          user_id: string
          warmup: boolean | null
        }
        Insert: {
          ai_summary?: string | null
          channel?: Database["public"]["Enums"]["campaign_channel"] | null
          compliance_check_passed?: boolean | null
          confirmation_log?: Json | null
          created_at?: string | null
          daily_send_limit?: number | null
          goal?: string | null
          icp_id?: string | null
          id?: string
          research_snapshot?: Json | null
          schedule_timezone?: string | null
          start_datetime?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
          warmup?: boolean | null
        }
        Update: {
          ai_summary?: string | null
          channel?: Database["public"]["Enums"]["campaign_channel"] | null
          compliance_check_passed?: boolean | null
          confirmation_log?: Json | null
          created_at?: string | null
          daily_send_limit?: number | null
          goal?: string | null
          icp_id?: string | null
          id?: string
          research_snapshot?: Json | null
          schedule_timezone?: string | null
          start_datetime?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          warmup?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_icp_id_fkey"
            columns: ["icp_id"]
            isOneToOne: false
            referencedRelation: "icps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          campaign_id: string | null
          contact_id: string | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      icps: {
        Row: {
          created_at: string | null
          description: string | null
          exclusions: string | null
          firmographics: Json | null
          id: string
          name: string
          notes: string | null
          roles: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          exclusions?: string | null
          firmographics?: Json | null
          id?: string
          name: string
          notes?: string | null
          roles?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          exclusions?: string | null
          firmographics?: Json | null
          id?: string
          name?: string
          notes?: string | null
          roles?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "icps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          name: string | null
          reply_to_email: string | null
          sending_from_email: string | null
          sending_from_name: string | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          industry?: string | null
          name?: string | null
          reply_to_email?: string | null
          sending_from_email?: string | null
          sending_from_name?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          reply_to_email?: string | null
          sending_from_email?: string | null
          sending_from_name?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sequence_steps: {
        Row: {
          body_html: string | null
          body_text: string | null
          campaign_id: string
          created_at: string | null
          id: string
          personalization_vars: Json | null
          send_window_end: string | null
          send_window_start: string | null
          step_order: number
          step_type: Database["public"]["Enums"]["step_type"] | null
          subject: string | null
          wait_days: number | null
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          campaign_id: string
          created_at?: string | null
          id?: string
          personalization_vars?: Json | null
          send_window_end?: string | null
          send_window_start?: string | null
          step_order: number
          step_type?: Database["public"]["Enums"]["step_type"] | null
          subject?: string | null
          wait_days?: number | null
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          campaign_id?: string
          created_at?: string | null
          id?: string
          personalization_vars?: Json | null
          send_window_end?: string | null
          send_window_start?: string | null
          step_order?: number
          step_type?: Database["public"]["Enums"]["step_type"] | null
          subject?: string | null
          wait_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_steps_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
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
      campaign_channel: "email" | "linkedin" | "sms" | "mixed"
      campaign_status:
        | "draft"
        | "ready"
        | "running"
        | "completed"
        | "paused"
        | "error"
      contact_status: "active" | "bounced" | "unsubscribed"
      step_type: "email" | "linkedin" | "sms" | "task"
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
      campaign_channel: ["email", "linkedin", "sms", "mixed"],
      campaign_status: [
        "draft",
        "ready",
        "running",
        "completed",
        "paused",
        "error",
      ],
      contact_status: ["active", "bounced", "unsubscribed"],
      step_type: ["email", "linkedin", "sms", "task"],
    },
  },
} as const
