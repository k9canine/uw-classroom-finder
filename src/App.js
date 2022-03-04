// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { vacantUntil } from './vacant_until.js';


function getAvailability(start_time, end_time, dayNum) {
  //finds the classrooms that are open for a given time range (inputted)
  var json = require('./new_json.json'); //with path

  // ========================================================================================================================

  //  hard-coded values right now:

  //REQUIRES: end time must be less than start time
  // let start_time = "08:30" //start time is when the person wants to go study
  // let end_time = "17:20" // end time is when the person will be done studying

  // NOTES: !!!
  // maybe we can use a dropdown menu to let them choose start and end times so it's easier to parse the data


  const daysOfWeek = ["M", "T", "W", "Th", "F"]
  // NOTES: !!!
  // again, a dropodown that lets them choose either the day of the week or a day on the calendar and we can use 
  //   the date module to determine which day of the week it is. 
  // disallow options for choosing the weekends.

  let day = daysOfWeek[dayNum - 1] // because dayNum will be between 1-5 for M to F so lower every value by 1 to get index

  // ===ACTUAL CODE===========================================================================================================

  function isOccupied(timeObject) {
    // takes the value component associated with a key and determines if the room is occupied
    //   during the time 
    // Obj -> Bool

    function timeBetween(initial, final, start_time, end_time) { //helper function for isOccupied
      let option1 = (initial < start_time && start_time < final)
      let option2 = (initial < end_time && end_time < final)
      let option3 = (start_time < initial && initial < end_time)
      let option4 = (start_time < final && final < end_time)
      let option5 = (start_time == initial && end_time == final)
      return option1 || option2 || option3 || option4 || option5
    }

    let timeList = timeObject[day];

    for (let i in timeList) {
      let time = timeList[i]
      let initial = time.slice(0, 5) // initial is the time that the class starts
      let final = time.slice(6, 12) // final is the time that the class ends

      if (timeBetween(initial, final, start_time, end_time)) {
        // or if the other way around initial is between start and end or final is between start and end

        return true; // occupied!
      }
    }
    return false // not occupied! - because true was never returned so the condition is never satisfied 
  }

  let availableClassrooms = [];

  for (const [classroom, value] of Object.entries(json)) {
    if (isOccupied(value) === false) {
      availableClassrooms.push(classroom)
    }
  }

  return availableClassrooms
}

function indexToDay(index) {// takes an index from 0-6 and returns Sun-Sat
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

function getDayOfWeek(date) { // date: YYYY-MM-DD
  const dayOfWeek = new Date(
    Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))
  ).getDay()
  return dayOfWeek
}



function formattedDay(num) {
  if (num < 10) {
    return "0" + num.toString();
  }
  else {
    return num.toString()
  }
}

function searchResults(dayOfWeek, dateSelected, start, end) {
  return `${dayOfWeek} ${dateSelected} | ${start} to ${end}`

  // <p className = "centered" style = {start === "" || end === "" ? {display: "none"} : {display: "block"}}>
  //           {dayWeekName} {dateSelected} | {start} to {end} 
  //         </p>
}



export default function Home() {
  const [time, setTime] = useState((new Date()).toLocaleTimeString());
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [submitCount, setSubmitCount] = useState(0)
  const [availableClassrooms, setAvailableClassrooms] = useState([])
  const [term, setTerm] = useState("Winter 2022")  // hard coded for now lol


  //hard coded rn: !!!!
  const endDate = "2022-04-05" // this is the last day of classes for the term (YYYY-MM-DD)

  //-----------------------------------------------------------------------------
  // finds today's date which allows for us to set the initial day on the calendar to today and make it so that we cannot select a day before today
  let currentDate = new Date()
  let dayMonth = currentDate.getDate() // produces the day of the month (1 - 31)
  // let dayWeek = currentDate.getDay();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear().toString();


  month = formattedDay(month);
  dayMonth = formattedDay(dayMonth)

  const [today, setToday] = useState(year + "-" + month + "-" + dayMonth)
  const [dateSelected, setDateSelected] = useState(year + "-" + month + "-" + dayMonth) //day selected by user

  //@@@
  const [dayWeek, setDayWeek] = useState(getDayOfWeek(dateSelected)) // produces the day of the week (0-6) (Sun - Sat)
  const [dayWeekName, setDayWeekName] = useState(indexToDay(dayWeek)) // produces the name of the day of the week
  const [resultInfo, setResultInfo] = useState(""); // resultInfo is the date/time of the search result



  //-----------------------------------------------------------------------------


  useEffect(() => {
    setTimeout(() => {
      setTime((new Date()).toLocaleTimeString())
    }, 1000)
  }, [time])

  useEffect(() => {
    setToday(year + "-" + month + "-" + dayMonth)
  }, [dayMonth])


  useEffect(() => {
    if (submitCount != 0) {
      if (dayWeek != 0 && dayWeek != 6) {
        setAvailableClassrooms(getAvailability(start, end, dayWeek))
      }
      else {
        setAvailableClassrooms(["No classes run on Sat/Sun, so all classrooms are available"])
      }
      // add a note on screen that says classes do not run on sat/sun so we will not produce results for those days
    }
  }, [submitCount])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitCount(prev => prev + 1)
    setResultInfo(searchResults(dayWeekName, dateSelected, start, end))
  }


  return <main>
    <p className="term-info">{term}</p>
    <h1 className="title">Waterloo Classroom Finder</h1>
    <p className="time">It is currently {today} {time}</p>

    <h2 className="study-text">I would like to study on:</h2>
    <form className="user-form" onSubmit={handleSubmit}>

      <input type="date" value={dateSelected} min={today} max={endDate} required
        onChange={
          e => {
            let dayofweek = getDayOfWeek(e.target.value)

            setDateSelected(e.target.value)
            setDayWeek(dayofweek)
            setDayWeekName(indexToDay(dayofweek))

          }
        }></input>

      <p>from</p>

      <input className="start" type="time" max={end === "" ? "" : `${end}`} required
        onChange={
          e => setStart(e.target.value)
        }></input>

      <p>to</p>

      <input className="end" type="time" min={start === "" ? "" : `${start}`} required
        onChange={
          e => setEnd(e.target.value)
        }></input>

      <button>Search</button>


    </form>
    <div className="scroll-div">
      <h2 className="available-text">Available Classrooms:</h2>
      <p>{resultInfo}</p>
      <ul className="scroll-list">
        {availableClassrooms.map((classroom, index) => <li key={index.toString()}>{classroom}</li>)}
      </ul>
    </div>

    <p className="centered">{availableClassrooms.length} results</p>
  </main>
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
