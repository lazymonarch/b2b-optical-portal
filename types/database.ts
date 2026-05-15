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
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['shops']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['shops']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
    }
  }
}
