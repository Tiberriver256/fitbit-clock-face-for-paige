import clock, { TickEvent } from 'clock';
import document from 'document';
import { preferences } from 'user-settings';
import { me as appbit } from 'appbit';

clock.granularity = 'minutes'; // seconds, minutes, hours

const clockLabel = document.getElementById('time');
const dateLabel = document.getElementById('date');

function getMonth(i) {
  switch (i) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return 'Error';
  }
}

// Update the <text> element with the current time
function updateClock(evt: TickEvent) {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === '12h') {
    hours = (hours + 24) % 12 || 12;
  }
  let mins = String(today.getMinutes());
  mins = mins.length === 2 ? mins : `0${mins}`;
  dateLabel.text = `${getMonth(today.getMonth())} ${today.getDate()}`;
  clockLabel.text = `${hours}:${mins}`;
  updateStats();
}

// Update the clock every tick event
clock.ontick = updateClock;

import { today } from 'user-activity';

const stepsLabel = document.getElementById('steps');
const caloriesLabel = document.getElementById('calories');

function updateStats() {
  if (appbit.permissions.granted('access_activity')) {
    console.log(`${today.adjusted.steps} Steps`);
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
    console.log(`Current heart rate: ${hrm.heartRate}`);
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
