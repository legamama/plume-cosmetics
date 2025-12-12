export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blog_media: {
        Row: {
          alt_text: string | null
          blog_post_id: string
          caption: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          sort_order: number | null
          type: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          blog_post_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          sort_order?: number | null
          type?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          blog_post_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          sort_order?: number | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_media_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          reading_time: number | null
          sort_order: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_translations: {
        Row: {
          blog_post_id: string
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          locale: string
          og_image_url: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          blog_post_id: string
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          locale: string
          og_image_url?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          blog_post_id?: string
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          locale?: string
          og_image_url?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_translations_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_translations_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
        ]
      }
      locales: {
        Row: {
          code: string
          created_at: string | null
          is_active: boolean | null
          is_default: boolean | null
          name: string
          native_name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          native_name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          native_name?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          bunny_cdn_url: string
          bunny_path: string
          created_at: string | null
          credits: string | null
          filename: string
          folder_id: string | null
          height: number | null
          id: string
          mime_type: string
          size_bytes: number | null
          updated_at: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bunny_cdn_url: string
          bunny_path: string
          created_at?: string | null
          credits?: string | null
          filename: string
          folder_id?: string | null
          height?: number | null
          id?: string
          mime_type: string
          size_bytes?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bunny_cdn_url?: string
          bunny_path?: string
          created_at?: string | null
          credits?: string | null
          filename?: string
          folder_id?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          size_bytes?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      media_folders: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_items: {
        Row: {
          badge_text: string | null
          created_at: string | null
          highlight: boolean | null
          href: string
          icon: string | null
          id: string
          is_enabled: boolean | null
          label: string
          locale: string
          nav_group: string
          parent_id: string | null
          position: number | null
          target: string | null
          updated_at: string | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string | null
          highlight?: boolean | null
          href: string
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          label: string
          locale: string
          nav_group?: string
          parent_id?: string | null
          position?: number | null
          target?: string | null
          updated_at?: string | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string | null
          highlight?: boolean | null
          href?: string
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          label?: string
          locale?: string
          nav_group?: string
          parent_id?: string | null
          position?: number | null
          target?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      page_definitions: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean | null
          locale: string
          page_type: string
          published_at: string | null
          route_pattern: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_og_image_url: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          locale: string
          page_type: string
          published_at?: string | null
          route_pattern?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_og_image_url?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          locale?: string
          page_type?: string
          published_at?: string | null
          route_pattern?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_og_image_url?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_definitions_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
        ]
      }
      page_sections: {
        Row: {
          config_json: Json
          created_at: string | null
          id: string
          is_enabled: boolean | null
          page_id: string
          position: number
          section_key: string | null
          section_type: string
          updated_at: string | null
        }
        Insert: {
          config_json?: Json
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          page_id: string
          position?: number
          section_key?: string | null
          section_type: string
          updated_at?: string | null
        }
        Update: {
          config_json?: Json
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          page_id?: string
          position?: number
          section_key?: string | null
          section_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          locale: string
          name: string
          seo_description: string | null
          seo_title: string | null
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          locale: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          locale?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_translations_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
        ]
      }
      product_external_links: {
        Row: {
          color: string | null
          created_at: string | null
          hover_color: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          label: string | null
          locale: string | null
          platform: string
          product_id: string
          sort_order: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          hover_color?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          locale?: string | null
          platform: string
          product_id: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          hover_color?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          locale?: string | null
          platform?: string
          product_id?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_external_links_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_external_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_size: number | null
          height: number | null
          id: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          type: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          type?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          type?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          compare_price: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          how_to_use: string | null
          id: string
          ingredients: string | null
          locale: string
          name: string
          og_image_url: string | null
          price: number | null
          product_id: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          compare_price?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          how_to_use?: string | null
          id?: string
          ingredients?: string | null
          locale: string
          name: string
          og_image_url?: string | null
          price?: number | null
          product_id: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          compare_price?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          how_to_use?: string | null
          id?: string
          ingredients?: string | null
          locale?: string
          name?: string
          og_image_url?: string | null
          price?: number | null
          product_id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          sku: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          sku?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          sku?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          created_at: string | null
          from_path: string
          id: string
          is_enabled: boolean | null
          locale: string | null
          site: string | null
          status_code: number | null
          to_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_path: string
          id?: string
          is_enabled?: boolean | null
          locale?: string | null
          site?: string | null
          status_code?: number | null
          to_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_path?: string
          id?: string
          is_enabled?: boolean | null
          locale?: string | null
          site?: string | null
          status_code?: number | null
          to_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      static_page_slots: {
        Row: {
          content_value: string | null
          created_at: string | null
          id: string
          locale: string
          page_id: string | null
          rich_content: Json | null
          slot_key: string
          updated_at: string | null
        }
        Insert: {
          content_value?: string | null
          created_at?: string | null
          id?: string
          locale: string
          page_id?: string | null
          rich_content?: Json | null
          slot_key: string
          updated_at?: string | null
        }
        Update: {
          content_value?: string | null
          created_at?: string | null
          id?: string
          locale?: string
          page_id?: string | null
          rich_content?: Json | null
          slot_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "static_page_slots_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "static_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      static_page_translations: {
        Row: {
          created_at: string | null
          id: string
          locale: string
          page_id: string | null
          seo_description: string | null
          seo_og_image_url: string | null
          seo_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          locale: string
          page_id?: string | null
          seo_description?: string | null
          seo_og_image_url?: string | null
          seo_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          locale?: string
          page_id?: string | null
          seo_description?: string | null
          seo_og_image_url?: string | null
          seo_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "static_page_translations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "static_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      static_pages: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_videos: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean
          order: number
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean
          order?: number
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean
          order?: number
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: { Args: { title: string }; Returns: string }
      get_all_pages: { Args: { p_locale: string }; Returns: Json }
      get_blog_post_by_slug: {
        Args: { p_locale: string; p_slug: string }
        Returns: Json
      }
      get_navigation: {
        Args: { p_locale: string; p_nav_group?: string }
        Returns: Json
      }
      get_page_content: {
        Args: { p_locale: string; p_slug: string }
        Returns: Json
      }
      get_product_by_slug: {
        Args: { p_locale: string; p_slug: string }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

