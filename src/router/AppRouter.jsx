import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar"
import { useAuthStore } from "../hooks"

export const AppRouter = () => {

  // console.log(getEnvVariables())
  // se llama en este punto ya que se debe determinar si se quiere mostrar el login o el main dependiendo de si el token sigue siendo valido o no
  const { status, ckeckAuthToken } = useAuthStore()

  useEffect(() => {
    ckeckAuthToken()
  }, [])

  if (status === 'cheking') {
    return (
      <h3>Cargando...</h3>
    )
  }

  return (
    <Routes>
      {
        (status === 'not-authenticated')
          ? (
            <>
              <Route path="/auth/*" element={< LoginPage />} />
              <Route path="/*" element={<Navigate to='/auth/login' />} />
            </>
          )
          : (
            <>
              <Route path="/" element={< CalendarPage />} />
              <Route path="/*" element={<Navigate to='/' />} />
            </>
          )
      }
    </Routes>
  )
}
