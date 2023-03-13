import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../API"
import { clearErrorMessage, onCheking, onLogin, onLogout } from "../store/auth/authSlice"
import { onLogoutCalendar } from "../store/calendar/calendarSlice"

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const startLogin = async ({ email, password }) => {
        // console.log({ email, password });
        // conexion con el backend
        dispatch(onCheking())

        try {
            // desestructura la data
            const { data } = await calendarApi.post('/auth', { email, password })

            // obtenemos el token
            localStorage.setItem('token', data.token)
            // obtenemos la fecha de creacion del token
            localStorage.setItem('token-init-date', new Date().getTime())
            // se graba el usuario loggeado
            dispatch(onLogin({ name: data.name, uid: data.uid }))

        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'))

            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10);
        }
    }

    const startRegister = async ({ email, name, password }) => {

        dispatch(onCheking())
        try {
            // desestructura la data
            const { data } = await calendarApi.post('/auth/new', { email, name, password })

            // obtenemos el token
            localStorage.setItem('token', data.token)
            // obtenemos la fecha de creacion del token
            localStorage.setItem('token-init-date', new Date().getTime())
            // se graba el usuario loggeado
            dispatch(onLogin({ name: data.name, uid: data.uid }))

        } catch (error) {
            dispatch(onLogout(error.response.data?.msg || ''))
            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10);
        }
    }

    const ckeckAuthToken = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            return dispatch(onLogout())
        }

        try {
            const { data } = await calendarApi.get('/auth/renew')
            // obtenemos el token
            localStorage.setItem('token', data.token)
            // obtenemos la fecha de creacion del token
            localStorage.setItem('token-init-date', new Date().getTime())
            // se graba el usuario loggeado
            dispatch(onLogin({ name: data.name, uid: data.uid }))

        } catch (error) {
            localStorage.clear()
            dispatch(onLogout())
        }
    }

    const startLogout = () => {
        localStorage.clear()
        dispatch(onLogoutCalendar())
        dispatch(onLogout())
    }

    return {
        //propiedades
        user,
        status,
        errorMessage,

        //metodos
        startLogin,
        startLogout,
        startRegister,
        ckeckAuthToken,
    }
}