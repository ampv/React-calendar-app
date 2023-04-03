import axios from 'axios'
import { getEnvVariables } from '../helpers'

const { VITE_API_URL } = getEnvVariables()

const calendarApi = axios.create({
    baseURL: VITE_API_URL
})

// interceptores
calendarApi.interceptors.request.use(config => {

    // cualquier peticion que se haga con el calendarApi, automaticamente se le ponga el token 
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config
})

export default calendarApi