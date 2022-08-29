const Time = require("../helpers/timeClass");

function initialRanges({ open, close, breakTimeInMinute, breakeHour }) {
  const startToBreak = Time.subtract(new Time(breakeHour), new Time(open));
  const endBreak = new Time(breakeHour + breakTimeInMinute);
  const endBreakeToClose = Time.subtract(new Time(close), endBreak);

  return [
    createRange(open, startToBreak.getTimeInMinutes()),
    createRange(breakeHour, breakTimeInMinute, false, false),
    createRange(endBreak.time(), endBreakeToClose.getTimeInMinutes()),
  ];
}

function createRange(start, time, user = null, available = true) {
  // console.log(Time.add(new Time(start), time));
  return {
    start: start,
    time: time,
    endTime: Time.add(new Time(start), time).time(),
    user: user,
    available: user ? false : available,
  };
}

function insertRange(oldRange, start, time, user) {
  const ranges = [];
  const newRange = createRange(start, time, user);
  const oldRangeTime = Time.subtract(
    new Time(start),
    new Time(oldRange.start)
  ).getTimeInMinutes();

  if (oldRangeTime !== 0) {
    ranges.push(createRange(oldRange.start, oldRangeTime));
  }
  ranges.push(newRange);

  if (oldRange.endTime !== newRange.endTime) {
    ranges.push(
      createRange(
        newRange.endTime,
        Time.subtract(
          new Time(oldRange.endTime),
          new Time(newRange.endTime)
        ).getTimeInMinutes()
      )
    );
  }

  return ranges;
}

module.exports = { initialRanges, createRange, insertRange };
