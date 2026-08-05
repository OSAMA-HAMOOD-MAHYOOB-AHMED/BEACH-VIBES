import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products';

const ProductsContext = createContext(null);

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    tone: row.tone,
    image: row.image,
    material: row.material,
    brand: row.brand ?? 'Beach Vibes',
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviews: row.reviews ?? 0,
    isNew: row.is_new ?? false,
    isSignature: row.is_signature ?? false,
    description: row.description,
    notes: row.notes ?? undefined,
    name_ar: row.name_ar ?? undefined,
    description_ar: row.description_ar ?? undefined,
    notes_ar: row.notes_ar ?? undefined,
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('static');

  useEffect(() => {
    let cancelled = false;

    api
      .get('/api/products')
      .then((data) => {
        if (cancelled) return;
        if (data.products && data.products.length > 0) {
          setProducts(data.products.map(mapRow));
          setSource('backend');
        }
      })
      .catch(() => {
        // Backend unreachable — keep the static catalog.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const findProduct = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return (id) => byId.get(id);
  }, [products]);

  const value = { products, loading, source, findProduct };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
