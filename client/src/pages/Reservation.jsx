import React, { useState, useEffect } from "react";
import Gimage from '../assets/icons8-gym-100.png';

const Reservation = () => {
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Calendar state
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [blankDays, setBlankDays] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventTheme, setEventTheme] = useState('blue');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  
  // Events data
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    { value: "blue", label: "Blue Theme" },
    { value: "red", label: "Red Theme" },
    { value: "yellow", label: "Yellow Theme" },
    { value: "green", label: "Green Theme" },
    { value: "purple", label: "Purple Theme" }
  ];

  // Initialize calendar and load events
  useEffect(() => {
    calculateCalendarDays();
    loadEvents();
  }, [month, year]);

  // Calculate calendar days for current month
  const calculateCalendarDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate first day of month (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    // Adjust for Monday as first day of week
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Set blank days (days from previous month)
    const blankDaysArray = Array.from({ length: firstDayOfMonth }, (_, i) => i + 1);
    setBlankDays(blankDaysArray);
    
    // Set days for current month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    setDays(daysArray);
  };

  // Load events from local storage and API
  const loadEvents = async () => {
    try {
      // First load from localStorage
      const savedEvents = localStorage.getItem('calendarEvents') || '[]';
      const localEvents = JSON.parse(savedEvents);
      setEvents(localEvents);
      
      // Then try to fetch from API
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/reservation/user');
      
      if (response.ok) {
        const apiEvents = await response.json();
        
        // Format API events to match our structure
        const formattedEvents = apiEvents.map(event => ({
          id: event._id,
          title: event.title,
          theme: event.eventTheme || 'blue',
          startTime: event.startTime,
          endTime: event.endTime,
          date: new Date(event.eventDate).toDateString()
        }));
        
        setEvents(formattedEvents);
        localStorage.setItem('calendarEvents', JSON.stringify(formattedEvents));
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(year, month, date);
    return today.toDateString() === checkDate.toDateString();
  };

  // Show modal for adding event
  const openEventModal = (date) => {
    const eventDate = new Date(year, month, date);
    setSelectedDate(eventDate);
    setShowModal(true);
    
    // Reset form fields
    setEventTitle('');
    setEventTheme('blue');
    setStartTime('09:00');
    setEndTime('10:00');
  };

  // Add new event
  const addEvent = async () => {
    if (!eventTitle.trim()) {
      return;
    }
    
    // Validate times
    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }
    
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      theme: eventTheme,
      startTime,
      endTime,
      date: selectedDate.toDateString()
    };
    
    // Add to local state first
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    
    // Try to save to API
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/reservation', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventTitle,
          eventTheme,
          startTime,
          endTime,
          eventDate: selectedDate.toDateString()
        }),
      });

      if (res.ok) {
        // Refresh data after successful save
        loadEvents();
      }
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const currentDateString = new Date(year, month, day).toDateString();
    return events.filter(event => event.date === currentDateString);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="antialiased sans-serif bg-gray-100 h-screen">
      <div className="container mx-auto px-4 py-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between py-2 px-9">
            <div>
              <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
              <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
            </div>
            <img src={Gimage} className="h-8" alt="Gym icon"/>
            <div className="border rounded-lg px-1" style={{ paddingTop: "2px" }}>
              <button 
                type="button"
                className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                onClick={goToPrevMonth}
              >
                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>  
              </button>
              <div className="border-r inline-flex h-6"></div>    
              <button 
                type="button"
                className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                onClick={goToNextMonth}
              >
                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>                  
              </button>
            </div>
          </div>  

          {/* Calendar Grid */}
          <div className="-mx-1 -mb-1">
            {/* Day Names */}
            <div className="flex flex-wrap border-t border-l">
              {DAY_NAMES.map((day, index) => (
                <div 
                  key={index}
                  style={{ width: "14.28%" }}
                  className="text-center font-medium text-gray-700 border-r border-b px-4 py-2 bg-gray-50"
                >
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="flex flex-wrap border-l">
              {/* Blank days */}
              {blankDays.map((_, index) => (
                <div 
                  key={`blank-${index}`}
                  style={{ width: "14.28%", height: "120px" }}
                  className="text-center border-r border-b px-4 pt-2"
                ></div>
              ))}
              
              {/* Actual days */}
              {days.map((date, index) => (
                <div 
                  key={index}
                  style={{ width: "14.28%", height: "120px" }} 
                  className="px-4 pt-2 border-r border-b relative"
                >
                  <div
                    onClick={() => openEventModal(date)}
                    className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${
                      isToday(date) ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-200'
                    }`}
                  >
                    {date}
                  </div>
                  
                  {/* Events for this day */}
                  <div style={{ height: "80px" }} className="overflow-y-auto mt-1">
                    {getEventsForDay(date).map((event, eventIndex) => (
                      <div
                        key={`${event.id}-${eventIndex}`}
                        className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border
                          ${event.theme === 'blue' ? 'border-blue-200 text-blue-800 bg-blue-100' : ''}
                          ${event.theme === 'red' ? 'border-red-200 text-red-800 bg-red-100' : ''}
                          ${event.theme === 'yellow' ? 'border-yellow-200 text-yellow-800 bg-yellow-100' : ''}
                          ${event.theme === 'green' ? 'border-green-200 text-green-800 bg-green-100' : ''}
                          ${event.theme === 'purple' ? 'border-purple-200 text-purple-800 bg-purple-100' : ''}
                        `}
                      >
                        <p className="text-sm truncate leading-tight">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.startTime} - {event.endTime}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full">
          <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
            <div className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
              onClick={() => setShowModal(false)}>
              <svg className="fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
              </svg>
            </div>

            <div className="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8">
              <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Add Event Details</h2>
              
              {/* Date information */}
              <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-800 font-bold text-lg">{selectedDate && formatDate(selectedDate)}</div>
              </div>
              
              {/* Form Fields */}
              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm">Event title</label>
                <input 
                  className="bg-gray-200 border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700"
                  type="text" 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </div>

              <div className="flex mb-4 space-x-4">
                <div className="w-1/2">
                  <label className="text-gray-800 block mb-1 font-bold text-sm">Start Time</label>
                  <input 
                    className="bg-gray-200 border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700" 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-gray-800 block mb-1 font-bold text-sm">End Time</label>
                  <input 
                    className="bg-gray-200 border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700" 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm">Select a theme</label>
                <select 
                  value={eventTheme}
                  onChange={(e) => setEventTheme(e.target.value)}
                  className="block w-full bg-gray-200 border-2 border-gray-200 px-4 py-2 rounded-lg text-gray-700"
                >
                  {themes.map((theme) => (
                    <option key={theme.value} value={theme.value}>{theme.label}</option>
                  ))}
                </select>
              </div>

              <div className="mt-8 text-right">
                <button 
                  type="button" 
                  className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>  
                <button 
                  type="button" 
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm"
                  onClick={addEvent}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Event'}
                </button>  
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;