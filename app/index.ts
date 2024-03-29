import clock, { TickEvent } from 'clock';
import document from 'document';
import { preferences } from 'user-settings';
import { me as appbit } from 'appbit';
import * as newfile from "./newfile";
import { toFahrenheit } from "../common/utils";
import { units } from "user-settings";
import { BatteryIndicator } from './battery-indicator';

clock.granularity = 'minutes'; // seconds, minutes, hours

const clockLabel = document.getElementById('time');
const dateLabel = document.getElementById('date');
const batteryIndicator = new BatteryIndicator(document);

const DAYS = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

// Update the <text> element with the current time
function updateClock(evt: TickEvent) {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === '12h') {
    hours = (hours + 24) % 12 || 12;
  }
  let mins = String(today.getMinutes());
  mins = mins.length === 2 ? mins : `0${mins}`;
  dateLabel.text = `${DAYS[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()}`;
  clockLabel.text = `${hours}:${mins}`;
  updateStats();
  batteryIndicator.draw()
}

// Update the clock every tick event
clock.ontick = updateClock;

import { today } from 'user-activity';

const stepsLabel = document.getElementById('steps');
const caloriesLabel = document.getElementById('calories');

function updateStats() {
  if (appbit.permissions.granted('access_activity')) {
    stepsLabel.text = today.adjusted.steps.toString();
    caloriesLabel.text = today.adjusted.calories.toString();
  }
}

import { HeartRateSensor } from 'heart-rate';
import { BodyPresenceSensor } from 'body-presence';

if (HeartRateSensor) {
  const heartRateLabel = document.getElementById('heart-rate');
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener('reading', () => {
    heartRateLabel.text = hrm.heartRate.toString();
  });
  hrm.start();

  if (BodyPresenceSensor) {
    const body = new BodyPresenceSensor();
    body.addEventListener('reading', () => {
      if (!body.present) {
        hrm.stop();
        heartRateLabel.text = '---';
      } else {
        hrm.start();
      }
    });
    body.start();
  }
}

const weather = document.getElementById('weather')

newfile.initialize(data => {
  // fresh weather file received

  // If the user-settings temperature == F and the result data.unit == Celsius then we convert to Fahrenheit
  // Use this only if you use getWeatherData() function without the optional parameter.
  data = units.temperature === "F" ? toFahrenheit(data): data;

  weather.text = `${data.temperature}\u00B0`

});
