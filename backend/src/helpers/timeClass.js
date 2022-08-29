class Time {
  constructor(time = "00:00") {
    const [hour, minute] = time.split(":");
    this.date = new Date();
    this.date.setHours(hour, minute, 0, 0);
  }

  time() {
    return this.date.toLocaleTimeString("eu", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  getTimeInMinutes() {
    return this.date.getHours() * 60 + this.date.getMinutes();
  }

  static subtract(time1, time2) {
    return new Time(`00:${Math.abs(time1.date - time2.date) / 60000}`);
  }

  static add(time1, time2) {
    return new Time(`00:${time1.getTimeInMinutes() + parseInt(time2)}`);
  }
}

module.exports = Time;
