Date.prototype.monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

Date.prototype.getMonthName = function (month) {
  return this.monthNames[month];
};

const fillDays = (year, month) => {
  const daysAmount = new Date(year, month + 1, 0).getDate();
  console.log(daysAmount);
  const days = Array(daysAmount)
    .fill(null)
    .map((v, i) => {
      const date = new Date(year, month, i + 1);
      const name = date.toLocaleString("en-us", { weekday: "long" });
      const available = name === "Saturday" || name === "Sunday" ? false : true;

      return {
        day: date.getDate(),
        name: name,
        available: available,
      };
    });

  return days;
};

function createCalendar(increment = 0) {
  const date = new Date();
  const monthWithIncrement = new Date().getMonth() + increment;

  const month =
    monthWithIncrement <= 11 ? monthWithIncrement : monthWithIncrement - 12;
  const year =
    monthWithIncrement <= 11 ? date.getFullYear() : date.getFullYear() + 1;
  const days = fillDays(year, month);

  return {
    year: year,
    month: date.getMonthName(month),
    days: days,
  };
}

module.exports = createCalendar;
