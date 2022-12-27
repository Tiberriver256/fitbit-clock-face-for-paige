/**
 * Add zero in front of numbers < 10
 * @param {number} i
 */
export function zeroPad(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  /**
   * Find the friendly name for a weather conditionCode.
   * @param {*} conditionCode 
   * @returns 
   */
  export function findWeatherConditionName(WeatherCondition, conditionCode) {
    for (const condition of Object.keys(WeatherCondition)) {
      if (conditionCode === WeatherCondition[condition]) return condition;
    }
  }
  
  /**
  * Convert Celsius to Fahrenheit
  * @param {object} data - WeatherData -
  */
  export function toFahrenheit(data) {
    if (data.unit.toLowerCase() === "celsius") {
       data.temperature =  Math.round((data.temperature * 1.8)+32);
       data.unit = "Fahrenheit";
    }
    
    return data
  }