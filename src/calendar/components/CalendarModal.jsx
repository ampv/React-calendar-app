import { addHours, differenceInSeconds } from "date-fns";
import es from 'date-fns/locale/es';
import { useEffect, useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import { useCalendarStore } from "../../hooks/useCalendarStore";
import { useUiStore } from "../../hooks/useUiStore";

registerLocale('es', es)

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
Modal.setAppElement('#root'); // para que se pueda sobreponer en la app

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore() //se usa para abrir y cerrar la modal
    const { activeEvent, sartSavingEvent } = useCalendarStore()
    const [formSubmitted, setFormSubmitted] = useState(false) //se usa para saber cuando el usuario hace el submit del formulario

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
    })

    //memoriza el valor 
    //el titulo es dependencia, es decir, el titulo es el que se memoriza cada que hagan un submit del formulario 
    const tittleClass = useMemo(() => {
        if (!formSubmitted) {
            return ''
        }

        return (formValues.title.length > 0)
            ? ''
            : 'is-invalid'

    }, [formValues.title, formSubmitted])

    //el evento se dispara cada que el active event cambia.
    //se utiliza para tomar los datos del evento para que aparezcan en la modal
    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({ ...activeEvent })
        }
    }, [activeEvent])


    //actualizando el valor que viene en el target
    const onInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onCloseModal = () => {
        closeDateModal()
    }

    const onDateChange = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setFormSubmitted(true)

        //validacion de que la fecha final sea mayor que la fecha inicial
        const difference = differenceInSeconds(formValues.end, formValues.start)

        //Si NO es un numero
        if (isNaN(difference)) {
            Swal.fire('Error', 'La fecha no tiene el formato de entrada correcto.', 'error')
            return
        }

        //Si la diferencia es menor a cero
        if (difference <= 0) {
            Swal.fire('Error', 'La fecha de inicio no puede ser mayor que la fecha de fin.', 'error')
            return
        }

        //titulo del evento obligatorio
        if (formValues.title.length <= 0) {
            Swal.fire('Error', 'Por favor ingrese un titulo para el evento.', 'error')
            return
        }

        // console.log(formValues);
        await sartSavingEvent(formValues)
        closeDateModal()
        setFormSubmitted(false)

    }

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className='modal'
            overlayClassName={'modal-fondo'}
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker
                        selected={formValues.start}
                        className='form-control'
                        onChange={(event) => onDateChange(event, 'start')}
                        dateFormat='Pp'
                        showTimeSelect
                        locale={'es'} //propiedad para que el calendario sea en español
                        timeCaption='Hora' //propiedad para que el tiempo sea en español
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker
                        minDate={formValues.start}
                        selected={formValues.end}
                        className='form-control'
                        onChange={(event) => onDateChange(event, 'end')}
                        dateFormat='Pp'
                        showTimeSelect
                        locale={'es'}
                        timeCaption='Hora'

                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${tittleClass}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>

        </Modal>
    )
}
