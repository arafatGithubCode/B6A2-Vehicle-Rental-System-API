// role type
const roleType = {
  admin: "admin",
  customer: "customer",
};
// vehicle's allowed types
const allowedVehicleType = ["car", "bike", "van", "suv"];
// vehicle available status
const vehicleAvailableStatus = ["available", "booked"];
// allowed booking status
const allowedBookingStatus = ["active", "cancelled", "returned"];

export {
  allowedBookingStatus,
  allowedVehicleType,
  roleType,
  vehicleAvailableStatus,
};
