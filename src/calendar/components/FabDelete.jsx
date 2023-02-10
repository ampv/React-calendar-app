import { useCalendarStore } from "../../hooks"

export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected } = useCalendarStore()

    const handleClickNew = () => {
        startDeletingEvent()
    }

    return (
        <button className="btn btn-danger fab-danger"
            onClick={handleClickNew}
            style={{
                display: hasEventSelected
                    ? ''
                    : 'none'
            }}>
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}
