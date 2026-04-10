export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getAuth() {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return null
    return verifyToken(token)
}

/** GET /api/stores/[storeId]/products – list all products for a store */
export async function GET(
    request: NextRequest,
    { params }: { params: { storeId: string } }
) {
    try {
        const auth = getAuth()
        if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const { storeId } = params

        // Verificar propiedad
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        })

        if (!store || store.userId !== auth.userId) {
            return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
        }

        const products = await prisma.storeProduct.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ products })
    } catch (err) {
        console.error('[GET /api/stores/products]', err)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

/** POST /api/stores/[storeId]/products – create a new product */
export async function POST(
    request: NextRequest,
    { params }: { params: { storeId: string } }
) {
    try {
        const auth = getAuth()
        if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const { storeId } = params
        const body = await request.json()
        const { name, description, price, pricePromo, stock, images, active, category, points, currency } = body

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // Verificar propiedad
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        })

        if (!store || store.userId !== auth.userId) {
            return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
        }

        const productData: any = {
            storeId,
            name,
            description: description || '',
            category: category || 'General',
            price: Number(price),
            currency: currency || 'USD',
            points: points !== undefined ? Number(points) : 0,
            stock: Number(stock) || 0,
            images: images || [],
            active: active !== undefined ? active : true,
        }

        if (pricePromo !== undefined && pricePromo !== '' && pricePromo !== null) {
            productData.pricePromo = Number(pricePromo)
        }

        let product
        try {
            product = await prisma.storeProduct.create({ data: productData })
        } catch (err: any) {
            // If price_promo column doesn't exist yet (migration pending), retry without it
            if (productData.pricePromo !== undefined && (err?.message?.includes('price_promo') || err?.code === 'P2022')) {
                delete productData.pricePromo
                product = await prisma.storeProduct.create({ data: productData })
            } else {
                throw err
            }
        }

        return NextResponse.json({ product }, { status: 201 })
    } catch (err) {
        console.error('[POST /api/stores/products]', err)
        return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
    }
}
