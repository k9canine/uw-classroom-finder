/**
 * Returns the day of the week using an index value
 * @param {number} index 0-6, corresponding to Sun-Sat
 * @returns {string} 
 */
function indexToDay(index) {
    if (index === 0) {
      return "Sunday"
    }
    if (index === 1) {
      return "Monday"
    }
    if (index === 2) {
      return "Tuesday"
    }
    if (index === 3) {
      return "Wednesday"
    }
    if (index === 4) {
      return "Thursday"
    }
    if (index === 5) {
      return "Friday"
    }
    if (index === 6) {
      return "Saturday"
    }
  }
  
  /**
   * This function deconstructs a date and finds which day of the week it is
   * @param {string} date:  YYYY-MM-DD
   * @returns {number} 0-6
   */
  function getDayOfWeek(date) { 
    const dayOfWeek = new Date(
      Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))
    ).getDay()
    return dayOfWeek
  }
  
  
/**
 * This function converts the day value to a string  
 * @param {number} num || the day number (1-31) 
 * @returns {string}
 */
  function formattedDay(num) {
    if (num < 10) {
      return "0" + num.toString();
    }
    else {
      return num.toString()
    }
  }
  
/**
 * This function returns a string for the search query
 * @param {string} dayOfWeek 
 * @param {string} dateSelected 
 * @param {string} start 
 * @param {string} end 
 * @returns {string}
 */  
  function searchResults(dayOfWeek, dateSelected, start, end) {
    return `${dayOfWeek} ${dateSelected} | ${start} to ${end}`
  }
  

/**
 * This function returns the text for when the classroom is occupied until
 * @param {string} classroom 
 * @param {string} vacantUntilTime 
 * @returns {string}
 */
  function availabilityText(classroom, vacantUntilTime) {
    if (classroom === '') {
      return ''
    }
    if (vacantUntilTime === null) {
      return 'This classroom is free for the rest of the day.'
    }
    return `This classroom is free until ${vacantUntilTime}.`
  }


  export {indexToDay, getDayOfWeek, formattedDay, searchResults, availabilityText};
  