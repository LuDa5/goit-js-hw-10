
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('button[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let countdownInterval = null;
let userSelectedDate = null;

startButton.disabled = true; 

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({ title: 'Error', message: 'Please choose a date in the future' });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      dateTimePicker.disabled = false;
      startButton.disabled = true;
      iziToast.success({ title: 'Complete', message: 'Countdown has ended!' });
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    daysSpan.textContent = days;
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
  }, 1000);
});