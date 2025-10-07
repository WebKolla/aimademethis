export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_upvotes: {
        Args: { product_id: string }
        Returns: undefined
      }
      increment_product_views: {
        Args: { product_id: string }
        Returns: undefined
      }
      increment_upvotes: {
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
