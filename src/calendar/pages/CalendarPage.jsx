import { useEffect, useState } from 'react'
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from "../"
import { getMessagesES, localizer } from '../../helpers'
import { useAuthStore } from '../../hooks'
import { useCalendarStore } from '../../hooks/useCalendarStore'
import { useUiStore } from '../../hooks/useUiStore'

export const CalendarPage = () => {

  const { user } = useAuthStore()

  // se desestructura este metodo de la clase useUiStore para abrir la modal
  const { openDateModal } = useUiStore()

  //se desestructuran las propiedades pa
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore()

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')

  const eventStyleGetter = (event, start, end, isSelected) => {

    const isMyEvent = (user.uid===event.user._id) || (user.uid===event.user.uid)

    const style = {
      backgroundColor: isMyEvent? '#008CDC' : '#868686',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  const onDoubleClick = () => {
    openDateModal()
  }

  const onSelected = (event) => {
    setActiveEvent(event)
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
    setLastView(event)
  }

  useEffect(() => {
    startLoadingEvents()
  }, [])


  return (
    <>
      <NavBar />

      <Calendar
        culture='es' //cambia el idioma
        localizer={localizer}
        events={events}
        defaultView={lastView} //hace que al regargar se quede en la ultima visualización
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }} //hace que no haya scroll en la pagina
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter} //cambia el estilo 
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelected}
        onView={onViewChanged}
      />
      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  )
}
