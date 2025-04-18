export function getObjectIdFromNumber(id: number) {
  const hex = id.toString(16).padStart(24, "0");
  return hex.slice(0, 24); // Ensure it's exactly 24 hex chars
}
