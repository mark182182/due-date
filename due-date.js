const { InvalidWorkingDayError } = require('./invalid-working-day-exception'),
  { InvalidDateError } = require('./invalid-date-exception');

class DueDate {

  calculateDueDate(submitDate, turnaroundTime) {
    if (turnaroundTime < 0) {
      turnaroundTime *= -1;
    }

    if (this.isWorkday(submitDate)) {
      const addHours = this.addHoursToDate(submitDate, turnaroundTime);
      return this.checkWorkinghours(addHours);
    } else {
      throw new InvalidWorkingDayError('Cannot submit on a non-working day');
    }
  }

  isWorkday(date) {
    try {
      return date.getDay() > 0 && date.getDay() < 6 ? true : false;
    } catch (error) {
      throw new InvalidDateError('Invalid date');
    }
  }

  addHoursToDate(date, hours) {
    return new Date(date.getTime() + this.hoursToMilisecs(this.convertToWorkingdayHours(hours)));
  }

  hoursToMilisecs(hours) {
    return hours * 3600000;
  }

  convertToWorkingdayHours(hours) {
    let correctedHours = 0;
    return hours >= 8 ? correctedHours += Math.floor(hours / 8) * 24 + hours % 8 : hours;
  }


  checkWorkinghours(date) {
    return this.isWorkingHours(date) && !this.isWeekend(date) ? date : this.adjustWorkingHours(date);
  }

  isWorkingHours(date) {
    return date.getHours() >= 9 && date.getHours() <= 16 || (date.getHours() <= 17 && date.getMinutes() === 0) ? true : false;
  }

  adjustWorkingHours(date) {
    if (this.isWeekend(date)) {
      return this.checkWeekendSkipping(date);
    } else {
      let nextDay = this.addHoursToDate(date, 8);
      nextDay = this.checkWeekendSkipping(nextDay);
      nextDay.setHours(9, date.getMinutes(), 0, 0);
      return date.getHours() > 17 ? this.addHoursToDate(nextDay, date.getHours() - 17) : this.addHoursToDate(nextDay, 17 - date.getHours());
    }
  }

  checkWeekendSkipping(date) {
    return this.isWeekend(date) ? this.skipWeekends(date) : date;
  }

  isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6 ? true : false;
  }

  skipWeekends(date) {
    let skippedDate;
    if (date.getDay() === 0) {
      skippedDate = this.addHoursToDate(date, 8);
    } else if (date.getDay() === 6) {
      skippedDate = this.addHoursToDate(date, 16);
    }
    return skippedDate;
  }
}

module.exports = { DueDate };