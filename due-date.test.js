const { DueDate } = require('./due-date'),
  { InvalidWorkingDayError } = require('./invalid-working-day-exception'),
  { InvalidDateError } = require('./invalid-date-exception');

const due = new DueDate(),
  submitTuesday = new Date('2019-07-30 14:12:00'),
  submitWednesday = new Date('2019-07-31 09:00:00'),
  submitFriday = new Date('2019-08-02 12:00:00'),
  submitSaturday = new Date('2019-08-03 09:00:00');

describe('Due date tests', () => {
  test('Due date should be in the prototype chain of Date', () => {
    expect(due.calculateDueDate(submitWednesday, 1) instanceof Date).toBeTruthy();
  });

  test('Should throw error if the submit date is not in the prototype chain of Date', () => {
    expect(() => { due.calculateDueDate('fail', 1) }).toThrow(InvalidDateError);
  });

  test('Should begin a new day after 17:00', () => {
    expect(due.calculateDueDate(submitTuesday, 16)).toStrictEqual(new Date('2019-08-01 14:12:00'));
  });

  test('Should return the same day if current day + given hours is less than 17', () => {
    expect(due.calculateDueDate(submitWednesday, 4).getDay()).toStrictEqual(3);
  });

  test('Should return the next day if current day + given hours is equal to 17', () => {
    expect(due.calculateDueDate(submitWednesday, 8).getDay()).toStrictEqual(4);
  });

  test('Should return the current day if given hours is less than 8 and time is qeual to 17', () => {
    expect(due.calculateDueDate(submitFriday, 5).getDay()).toStrictEqual(5);
  });

  test('Should return the next day if current day + given hours is greater than 17', () => {
    expect(due.calculateDueDate(submitWednesday, 10).getDay()).toStrictEqual(4);
  });

  test('Should skip the weekends from Saturday', () => {
    expect(due.calculateDueDate(submitFriday, 8)).toStrictEqual(new Date('2019-08-05 12:00:00'));
  });

  test('Should skip the weekends from Sunday', () => {
    expect(due.calculateDueDate(submitFriday, 16)).toStrictEqual(new Date('2019-08-05 12:00:00'));
  });

  test('Turnaround time should be absolute', () => {
    expect(due.calculateDueDate(submitWednesday, -1)).toStrictEqual(new Date('2019-07-31 10:00:00'));
  });

  test('0 turnaround time should return the original date', () => {
    expect(due.calculateDueDate(submitWednesday, 0)).toStrictEqual(submitWednesday);
  });

  test('Submit should work on weekdays', () => {
    expect(due.calculateDueDate(submitWednesday, 2)).toStrictEqual(new Date('2019-07-31 11:00:00'));
  });

  test('Submit should not work on weekdays before 9:00', () => {
    expect(() => due.calculateDueDate(new Date('2019-08-01 08:00:00'), 4).toThrow(InvalidWorkingDayError));
  });

  test('Submit should not work on weekdays after 17:00', () => {
    expect(() => due.calculateDueDate(new Date('2019-08-01 17:01:00'), 6).toThrow(InvalidWorkingDayError));
  });

  test('Submit should not work on weekends', () => {
    expect(() => due.calculateDueDate(submitSaturday, 2).toThrow(InvalidWorkingDayError));
  });
});