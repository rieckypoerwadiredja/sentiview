export function extractNumber(priceStr) {
  const cleaned = priceStr.replace(/[^0-9.,]/g, "").replace(",", "");
  return parseFloat(cleaned);
}
export function extractCurrencySymbol(priceStr) {
  const match = priceStr.match(/[^0-9.,\s]+/);
  return match ? match[0] : "";
}
