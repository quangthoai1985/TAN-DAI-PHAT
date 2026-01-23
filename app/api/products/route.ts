import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type'); // Optional filter by type (PAINT/TILE)

        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('products')
            .select('id, code, name, slug, price, images, type', { count: 'exact' })
            .order('created_at', { ascending: false });

        // Apply type filter if provided
        if (type && (type === 'PAINT' || type === 'TILE')) {
            query = query.eq('type', type);
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return NextResponse.json(
                { error: 'Failed to fetch products' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            products: data || [],
            total: count || 0,
            hasMore: offset + limit < (count || 0),
            page,
            limit,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
