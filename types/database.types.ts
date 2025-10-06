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
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          product_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          product_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          product_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string | null
          product_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          product_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          agentic_workflow_used: boolean | null
          ai_models_used: string[] | null
          ai_tools_used: string[] | null
          category_id: string | null
          commands_used: string[] | null
          created_at: string | null
          cursor_rules: string | null
          demo_url: string | null
          demo_video_url: string | null
          description: string
          development_approach: string | null
          development_time_hours: number | null
          featured: boolean | null
          github_url: string | null
          id: string
          ide_used: string[] | null
          image_url: string | null
          key_prompts: Json | null
          mcps_used: string[] | null
          metadata: Json | null
          name: string
          pricing_details: string | null
          pricing_type: string | null
          project_management_method: string | null
          slug: string
          status: string | null
          tagline: string
          tech_stack: string[] | null
          total_cost_usd: number | null
          total_token_cost: number | null
          twitter_handle: string | null
          ui_framework: string | null
          updated_at: string | null
          upvotes_count: number | null
          user_id: string
          video_url: string | null
          views_count: number | null
          voice_tools_used: string[] | null
          website_url: string | null
          workflow_description: string | null
        }
        Insert: {
          agentic_workflow_used?: boolean | null
          ai_models_used?: string[] | null
          ai_tools_used?: string[] | null
          category_id?: string | null
          commands_used?: string[] | null
          created_at?: string | null
          cursor_rules?: string | null
          demo_url?: string | null
          demo_video_url?: string | null
          description: string
          development_approach?: string | null
          development_time_hours?: number | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          ide_used?: string[] | null
          image_url?: string | null
          key_prompts?: Json | null
          mcps_used?: string[] | null
          metadata?: Json | null
          name: string
          pricing_details?: string | null
          pricing_type?: string | null
          project_management_method?: string | null
          slug: string
          status?: string | null
          tagline: string
          tech_stack?: string[] | null
          total_cost_usd?: number | null
          total_token_cost?: number | null
          twitter_handle?: string | null
          ui_framework?: string | null
          updated_at?: string | null
          upvotes_count?: number | null
          user_id: string
          video_url?: string | null
          views_count?: number | null
          voice_tools_used?: string[] | null
          website_url?: string | null
          workflow_description?: string | null
        }
        Update: {
          agentic_workflow_used?: boolean | null
          ai_models_used?: string[] | null
          ai_tools_used?: string[] | null
          category_id?: string | null
          commands_used?: string[] | null
          created_at?: string | null
          cursor_rules?: string | null
          demo_url?: string | null
          demo_video_url?: string | null
          description?: string
          development_approach?: string | null
          development_time_hours?: number | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          ide_used?: string[] | null
          image_url?: string | null
          key_prompts?: Json | null
          mcps_used?: string[] | null
          metadata?: Json | null
          name?: string
          pricing_details?: string | null
          pricing_type?: string | null
          project_management_method?: string | null
          slug?: string
          status?: string | null
          tagline?: string
          tech_stack?: string[] | null
          total_cost_usd?: number | null
          total_token_cost?: number | null
          twitter_handle?: string | null
          ui_framework?: string | null
          updated_at?: string | null
          upvotes_count?: number | null
          user_id?: string
          video_url?: string | null
          views_count?: number | null
          voice_tools_used?: string[] | null
          website_url?: string | null
          workflow_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          github: string | null
          id: string
          twitter: string | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github?: string | null
          id: string
          twitter?: string | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github?: string | null
          id?: string
          twitter?: string | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_product_views: {
        Args: { product_id: string }
        Returns: undefined
      }
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
