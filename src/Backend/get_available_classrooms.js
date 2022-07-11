
/**
 * This function returns a list of available classrooms at the given start and end time on a specific day
 * @param {string} start_time 
 * @param {string} end_time 
 * @param {number} dayNum a value between 1-5 corresponding to M-F 
 * @returns {string[]} 
 */
 const json = require('../sorted_data.json');
 const daysOfWeek = ["M", "T", "W", "Th", "F"]
 
function getAvailableClassrooms(start_time, end_time, dayNum) {
    let day = daysOfWeek[dayNum - 1] // dayNum will be between 1-5 for M to F so lower every value by 1 to get proper index
  
    let availableClassrooms = [];
  
    for (const [classroom, timeObject] of Object.entries(json)) {
      if (isOccupied(timeObject, day, start_time, end_time) === false) {
        availableClassrooms.push(classroom)
      }
    }
  
    return availableClassrooms
  }

/**
 * Helper for getAvailableClassrooms: checks if a class is happening in a specific classroom between the start and end time
 * @param {object} timeObject eg. {"M":["08:00-09:00", ... ], ...}
 * @param {string} day
 * @param {string} start_time
 * @param {string} end_time
 * @returns {boolean}
 */  
function isOccupied(timeObject, day, start_time, end_time) {
      let timeList = timeObject[day];
  
      for (let i in timeList) {
        let time = timeList[i]

        let initial = time.slice(0, 5) // initial is the time that the class starts
        let final = time.slice(6, 12) // final is the time that the class ends
  
        if (timeBetween(initial, final, start_time, end_time)) {
          return true; 
        }
      }
      return false
  }

/**
 * Helper function for isOccupied: checks if a time at which there is a class conflicts with the provided time range
 * @param {string} initial start time of the class
 * @param {string} final end time of the class
 * @param {string} start_time the time that the student wants to start studying
 * @param {string} end_time  the time that the student wants to end at
 * @returns {boolean}
 */
  function timeBetween(initial, final, start_time, end_time) { 
    let option1 = (initial < start_time && start_time < final)
    let option2 = (initial < end_time && end_time < final)
    let option3 = (start_time < initial && initial < end_time)
    let option4 = (start_time < final && final < end_time)
    let option5 = (start_time === initial && end_time === final)
    return option1 || option2 || option3 || option4 || option5
  }


  export {getAvailableClassrooms};