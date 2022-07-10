var data = require('../sorted_data.json'); //with path

const daysOfWeek = ["M", "T", "W", "Th", "F"];

const UPPER_BOUND = "3"; // don't change value, needs to be higher than 2 so that we can set the initial value if there is one

/**
 * This function takes in a room code, day of the week, and start time and finds the next start time after the one given
 * ** assumes that the room is currently unoccupied
 
 * @param {string} room_code  
 * @param {number} day_index  a number from 0 to 4 representing "M" to "F" in the daysOfWeek Array
 * @param {string} start_time the start time provided by the user (should be of the form: "XX:XX")
 * @returns {string} returns a string of the time when it is occupied next or "NULL" if there are no subsequent classes
 */
function vacantUntil(room_code, day_index, start_time) {
    let day = daysOfWeek[day_index]; // should be "M", "T" .. or "F"
    const timeList = data[room_code][day]; // this is now an array of times!
    const occurrences = timeList.length;

    let current_occ_time = UPPER_BOUND; // this stores the time at which the classroom is occupied next

    for (let i = 0; i < occurrences; i++){
        let time = timeList[i];
        let initial = time.slice(0,5); // initial is the time that the class starts
    
        if (start_time < initial && initial < current_occ_time) { 
            current_occ_time = initial;
        }    
    }

    if (current_occ_time == UPPER_BOUND) { 
        return null;
    }

    return current_occ_time; 
}

/*  TESTING

let room_code = "AL 211";
let day_index = 3;
let start_time = "18:20";

console.log(vacantUntil(room_code, day_index, start_time));

*/

export { vacantUntil };