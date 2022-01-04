//finds the classrooms that are open for a given time range (inputted)
var json = require('./new_json.json'); //with path


// ========================================================================================================================

//  hard-coded values right now:

//REQUIRES: end time must be less than start time
let start_time = "10:30" //start time is when the person wants to go study
let end_time = "14:18" // end time is when the person will be done studying

// NOTES: !!!
// maybe we can use a dropdown menu to let them choose start and end times so it's easier to parse the data


const daysOfWeek = ["M", "T", "W", "Th", "F"]
// NOTES: !!!
// again, a dropodown that lets them choose either the day of the week or a day on the calendar and we can use 
//   the date module to determine which day of the week it is. 
// disallow options for choosing the weekends.

let day = daysOfWeek[2]

// ===ACTUAL CODE===========================================================================================================

function isOccupied(timeObject){
    // takes the value component associated with a key and determines if the room is occupied
    //   during the time 
    // Obj -> Bool

    function timeBetween(initial, final, start_time, end_time){ //helper function for isOccupied
        let option1 = (initial < start_time && start_time < final) 
        let option2 = (initial < end_time && end_time < final)
        let option3 = (start_time < initial && initial < end_time)
        let option4 = (start_time < final && final < end_time)
        let option5 = (start_time == initial && end_time == final)
        return option1 || option2 || option3 || option4 || option5
    }

    let timeList = timeObject[day];

    for (let i in timeList){
        let time = timeList[i]
        let initial = time.slice(0,5) // initial is the time that the class starts
        let final = time.slice(6, 12) // final is the time that the class ends

        if (timeBetween(initial, final, start_time, end_time)){ 
            // or if the other way around initial is between start and end or final is between start and end

            return true; // occupied!
        }
    }
    return false // not occupied! - because true was never returned so the condition is never satisfied 
}

// TEST FOR isOccupied FUNCTION ==================================
// let testObject = {}

// console.log(isOccupied(testObject))


let availableClassrooms = [];
// let test_json = {
//     "AHS 1689": {
//         "M": [
//             "11:30-12:50",
//             "08:30-09:50",
//             "13:30-14:20",
//             "14:30-15:20"
//         ],
//         "T": [
//             "11:30-12:50",
//             "13:00-14:20",
//             "08:30-09:50",
//             "10:00-11:20"
//         ],
//         "W": [
//             "11:30-12:50",
//             "08:30-09:50",
//             "13:30-14:20",
//             "14:30-15:20",
//             "15:30-16:20",
//             "16:30-17:20"
//         ],
//         "Th": [
//             "11:30-12:50",
//             "13:00-14:20",
//             "08:30-09:50",
//             "10:00-11:20"
//         ],
//         "F": [
//             "10:00-11:20",
//             "08:30-09:50",
//             "13:30-14:20",
//             "14:30-15:20"
//         ]
//     },
//     "AHS 3683": {
//         "M": [],
//         "T": [
//             "10:30-12:20"
//         ],
//         "W": [
//             "09:30-11:20"
//         ],
//         "Th": [],
//         "F": [
//             "08:30-10:20",
//             "11:00-12:50"
//         ]
//     }}

for (const [classroom, value] of Object.entries(json)){
    if (isOccupied(value) === false) {
        availableClassrooms.push(classroom)
    }
}

console.log(availableClassrooms)
console.log(availableClassrooms.length)