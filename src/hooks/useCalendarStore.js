import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice"

export const useCalendarStore = () => {

    const dispatch = useDispatch()

    const {
        events, activeEvent
    } = useSelector(state => state.calendar)

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const sartSavingEvent = async (calendarEvent) => {
        if (calendarEvent._id) {
            //ACTUALIZANDO
            dispatch(onUpdateEvent({ ...calendarEvent }))
        } else {
            //CREANDO
            dispatch(onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }))
        }
    }

    const startDeletingEvent = () => {
        dispatch(onDeleteEvent())
    }


    return {
        //propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent, //Si es null regresa falso (para saber si hay un evento seleccionado)

        //eventos
        startDeletingEvent,
        setActiveEvent,
        sartSavingEvent,
    }
}
