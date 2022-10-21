// @flow
import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import BootstrapTheme from "@fullcalendar/bootstrap"
import PropTypes from "prop-types"

const Calendar = ({
  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events
}) => {

  const handleDateClick = arg => {
    onDateClick(arg)
  }
  const handleEventClick = arg => {
    onEventClick(arg)
  }
  const handleDrop = arg => {
    onDrop(arg)
  }
  const handleEventDrop = arg => {
    onEventDrop(arg)
  }

  return (
    <>
      <div id="calendar">
        <FullCalendar
          initialView="dayGridMonth"
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
            BootstrapTheme
          ]}
          handleWindowResize={true}
          themeSystem="bootstrap"
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List",
            prev: "Prev",
            next: "Next"
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
          }}
          editable={true}
          selectable={true}
          droppable={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          drop={handleDrop}
          eventDrop={handleEventDrop}
        />
      </div>
    </>
  )
}

Calendar.propTypes = {
  onDateClick: PropTypes.func,
  onEventClick: PropTypes.func,
  onEventDrop: PropTypes.func,
  onDrop: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string, 
    start: PropTypes.number,
    className: PropTypes.string
  }))
}
export default Calendar
