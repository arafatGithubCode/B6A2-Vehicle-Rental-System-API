const getNumberOfDays = (startDate: Date, endDate: Date) => {
  console.log(startDate, endDate, "result*****datae");
  const rent_start_date = new Date(startDate);
  const rent_end_date = new Date(endDate);
  const diffMs = rent_end_date.getTime() - rent_start_date.getTime();
  const numberOfDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return numberOfDays;
};

export default getNumberOfDays;
