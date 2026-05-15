export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          model_code: string
          name: string
          material: string | null
          size_mm: string | null
          per_packet_pcs: number | null
          std_packing_pcs: number | null
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          model_code: string
          name: string
          material?: string | null
          size_mm?: string | null
          per_packet_pcs?: number | null
          std_packing_pcs?: number | null
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          color_name: string
          color_hex: string | null
          image_url: string | null
          in_stock: boolean
        }
        Insert: {
          id?: string
          product_id: string
          color_name: string
          color_hex?: string | null
          image_url?: string | null
          in_stock?: boolean
        }
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
        Relationships: []
      }
      shops: {
        Row: {
          id: string
          user_id: string
          shop_name: string
          owner_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          shop_name: string
          owner_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['shops']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          shop_id: string
          status: 'pending' | 'confirmed' | 'dispatched' | 'delivered'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          status?: 'pending' | 'confirmed' | 'dispatched' | 'delivered'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          item_note: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          item_note?: string | null
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
