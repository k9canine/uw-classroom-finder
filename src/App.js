import './App.css';
import { useEffect, useState } from "react";
import { vacantUntil } from './Backend/vacant_until';
import { getAvailableClassrooms } from './Backend/get_available_classrooms';
import {indexToDay, getDayOfWeek, formattedDay, searchResults, availabilityText} from './Backend/helpers.js';

const WEEKEND_MESSAGE = 'No classes run on Sat/Sun, so all classrooms are available';


export default function Home() {
  const [time, setTime] = useState((new Date()).toLocaleTimeString());
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [submitCount, setSubmitCount] = useState(0)
  const [availableClassrooms, setAvailableClassrooms] = useState([])
  const [term, setTerm] = useState("Spring 2022")  // hard coded for now lol
  const [classroom, setClassroom] = useState(""); // this stores what classroom we want to find the end time for!
  const [vacantUntilTime, setVacantUntilTime] = useState(""); // this stores the time at which classroom is occupied next
  const [resultInfo, setResultInfo] = useState(""); // resultInfo is the date/time of the search result

  //hard coded rn: !!!!
  const endDate = "2022-08-22" // this is the last day of classes for the term (YYYY-MM-DD)

  //-----------------------------------------------------------------------------
  // finds today's date which allows for us to set the initial day on the calendar to today and make it so that we cannot select a day before today
  let currentDate = new Date()
  let dayMonth = currentDate.getDate() // produces the day of the month (1 - 31)
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear().toString();


  month = formattedDay(month);
  dayMonth = formattedDay(dayMonth)

  const [today, setToday] = useState(year + "-" + month + "-" + dayMonth)
  const [dateSelected, setDateSelected] = useState(year + "-" + month + "-" + dayMonth) //day selected by user

  const [dayWeek, setDayWeek] = useState(getDayOfWeek(dateSelected)) // produces the day of the week (0-6) (Sun - Sat)
  const [dayWeekName, setDayWeekName] = useState(indexToDay(dayWeek)) // produces the name of the day of the week
  
  //-----------------------------------------------------------------------------
  useEffect(() => {
    setTimeout(() => {
      setTime((new Date()).toLocaleTimeString())
    }, 1000)
  }, [time])

  // flag!
  // useEffect(() => {
  //   setToday(year + "-" + month + "-" + dayMonth)
  // }, [dayMonth])


  useEffect(() => {
    if (submitCount !== 0) {
      if (dayWeek !== 0 && dayWeek !== 6) {
        setAvailableClassrooms(getAvailableClassrooms(start, end, dayWeek))
      }
      else {
        setAvailableClassrooms([WEEKEND_MESSAGE])
      }
      
      document.getElementById("scroll-div-id").style.visibility = "visible";
    }
  }, [submitCount])

  useEffect(() => {
    if (classroom === '') {
      setVacantUntilTime("");
    }
    else {
      setVacantUntilTime(vacantUntil(classroom, dayWeek - 1, start));
    }
  }, [classroom])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitCount(prev => prev + 1)
    setResultInfo(searchResults(dayWeekName, dateSelected, start, end))
    setClassroom("");
  }


  return <main>
    <div className = "header">
      <div className = "title-time-box">
        <h1 className="title">Waterloo Classroom Finder</h1>
      </div>
      <div className = "term-box">
        <p className="term-info">{term}</p>
        <p className="time">It is currently {today} {time}</p>
      </div>
    </div>

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
      <div className="scroll-div" id = "scroll-div-id">
        <h2 className="available-text">Available Classrooms:</h2>
        <p className = "available-text">{resultInfo}</p>
        <div className='content'>
          <ul className="scroll-list">
            {availableClassrooms.map((classroom, index) => {
              if (classroom === WEEKEND_MESSAGE) {
                return <li key='weekend-message'>{classroom}</li>
              }

              return (
                <button className='availability-button'  onClick={() => setClassroom(classroom)}>
                  <li key={index.toString()}>{classroom}</li>
                </button>
              )
            })}
          </ul>  
          <div className = "availability-box">
            <h1 className='availability-header'>{classroom}</h1>
            <h6 className='availability-text'>{availabilityText(classroom, vacantUntilTime)}</h6>
          </div>
        </div>
        <p className="results">{availableClassrooms.length} results</p>
      </div>
     

    
  </main>
}