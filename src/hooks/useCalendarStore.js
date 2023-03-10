import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import calendarApi from "../API/calendarApi"
import { convertEventsToDateEvents } from "../helpers"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice"

export const useCalendarStore = () => {

    const dispatch = useDispatch()

    const { events, activeEvent } = useSelector(state => state.calendar)
    const { user } = useSelector(state => state.auth)

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const sartSavingEvent = async (calendarEvent) => {

        try {

            if (calendarEvent.id) {
                //ACTUALIZANDO
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)
                dispatch(onUpdateEvent({ ...calendarEvent, user }))
                return

            }
            //CREANDO
            const { data } = await calendarApi.post('events', calendarEvent)
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.msg.id, user }))

        } catch (error) {
            console.log(error)
            Swal.fire('Error al guardar el evento', error.response.data?.msg, 'error')
        }



    }

    const startDeletingEvent = async() => {

        try {
            await calendarApi.delete(`/events/${activeEvent.id}`)
            dispatch(onDeleteEvent())
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar el evento', error.response.data?.msg, 'error')
        }
    }

    const startLoadingEvents = async () => {

        try {
            const { data } = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.msg)
            dispatch(onLoadEvents(events))

        } catch (error) {

            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        //propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent, //Si es null regresa falso (para saber si hay un evento seleccionado)

        //eventos
        setActiveEvent,
        sartSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    }
}
