export const BUILDINGLINK_USERNAME = process.env.BUILDINGLINK_USERNAME!;
if (!BUILDINGLINK_USERNAME) {
  throw new Error('BUILDINGLINK_USERNAME is not set');
}
export const BUILDINGLINK_PASSWORD = process.env.BUILDINGLINK_PASSWORD!;
if (!BUILDINGLINK_PASSWORD) {
  throw new Error('BUILDINGLINK_PASSWORD is not set');
}
export const VISITOR_PASSWORD = process.env.VISITOR_PASSWORD!;
if (!VISITOR_PASSWORD) {
  throw new Error('VISITOR_PASSWORD is not set');
}
