// This module takes in a room code, day of the week, and start time and finds the next start time after the one given

var json = require('../Backend/new_json.json'); //with path

const daysOfWeek = ["M", "T", "W", "Th", "F"]

// room_code and start_time are strings, day_of_week is a number from 0 to 4 representing "M" to "F" in the daysOfWeek Array
//    returns a string of the time when it is occupied or "NULL" if there is no subsequent class
// requires: room_code is a valid string (the rest also need to be valid lol)

// start_time should be of the form: "XX:XX"
function vacantUntil(room_code, day_index, start_time) {
    let day = daysOfWeek[day_index]; // should be "M", "T" .. or "F"
    let timeList = json[room_code][day]; // this is now an array of times!

    let current_occ_time = "3"; // this stores the time at which the classroom is occupied next

    for (let i in timeList){
        let time = timeList[i]
        let initial = time.slice(0,5) // initial is the time that the class starts
        //let final = time.slice(6, 12) // final is the time that the class ends
    
        if (start_time < initial && initial < current_occ_time) { 
            current_occ_time = initial;
        }
        // otherwise keep going to the next time         
    }

    if (current_occ_time == "3") {
        return "free for the rest of the day"
    }
    return current_occ_time; 
    // it will be "" if it is free for the rest of the day, else will return the time when the next class starts    
}


// let room_code = "DC 1351";
// let day_index = 0;
// let start_time = "14:00";

// // let value = vacantUntil(room_code, day_index, start_time)
// console.log(vacantUntil(room_code, day_index, start_time));

export { vacantUntil };