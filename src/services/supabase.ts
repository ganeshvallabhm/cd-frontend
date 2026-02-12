import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ [SUPABASE] Missing environment variables');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Order data interface matching Supabase table schema
export interface SupabaseOrderData {
    name: string;
    phone: string;
    address: string;
    items: any; // JSON data - cart items
    total_amount: number;
}

// Create order function with enhanced debug logging
export const createOrder = async (orderData: SupabaseOrderData) => {
    console.log('📤 [SUPABASE] Creating order with data:', orderData);
    console.log('🔧 [SUPABASE] Environment check:', {
        hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        url: import.meta.env.VITE_SUPABASE_URL?.substring(0, 20) + '...'
    });

    try {
        console.log('⏳ [SUPABASE] Inserting into orders table...');
        const startTime = Date.now();

        // Insert order into Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        const duration = Date.now() - startTime;
        console.log(`⏱️ [SUPABASE] Request completed in ${duration}ms`);

        if (error) {
            console.error('❌ [SUPABASE] Error creating order:', error);
            console.error('❌ [SUPABASE] Error code:', error.code);
            console.error('❌ [SUPABASE] Error details:', error.details);
            console.error('❌ [SUPABASE] Error hint:', error.hint);
            throw new Error(error.message || 'Failed to create order');
        }

        console.log('✅ [SUPABASE] Order created successfully:', data);
        console.log('🆔 [SUPABASE] Generated Order ID:', data.id);
        return data;
    } catch (error: any) {
        console.error('❌ [SUPABASE] Unexpected error:', error);
        console.error('❌ [SUPABASE] Error type:', error.constructor.name);
        console.error('❌ [SUPABASE] Error stack:', error.stack);
        throw new Error(error.message || 'Failed to create order. Please try again.');
    }
};
