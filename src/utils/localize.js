export function localizeProduct(product, language) {
  if (!product || language !== 'ar') return product
  return {
    ...product,
    name: product.name_ar || product.name,
    description: product.description_ar || product.description,
    notes: product.notes_ar || product.notes,
  }
}
