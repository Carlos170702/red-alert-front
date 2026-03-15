import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '@/api'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials } from '@/store/auth/authSlice'
import { setStoredToken } from '@/services/auth.service'
import { ROUTES } from '@/constants'

export default function Login() {
  const userId = useId()
  const passId = useId()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!username || !password) {
      toast.error('Ingresa usuario y contraseña')
      return
    }

    try {
      const response = await api.post('/auth/login', { username, password })
      const { token, user, auth } = response.data

      dispatch(setCredentials({ token, user, auth }))
      setStoredToken(token)

      toast.success('Sesión iniciada')
      navigate(ROUTES.HOME, { replace: true })
    } catch {
      toast.error('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden grid text-gray-800">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-[1.05fr_1fr] bg-white overflow-hidden">
        <div className="relative grid place-items-center bg-white" aria-hidden="true">
          <div
            className="absolute left-0 top-0 w-0 h-0 border-solid border-t-[55vh] border-r-[28vw] border-t-[#d23b3b] border-r-transparent max-md:border-t-[35vh] max-md:border-r-[70vw]"
            aria-hidden
          />
          <div className="relative grid grid-flow-col gap-4 items-center pl-8 pr-4 pt-8 pb-8 md:pl-12 md:pr-6 md:pt-12 md:pb-12">
            <div className="font-display leading-none tracking-wide">
              <div className="text-8xl md:text-[120px] text-[#d23b3b]">RED</div>
              <div className="text-8xl md:text-[120px] text-gray-900">ALERT</div>
            </div>
          </div>
        </div>

        <div className="grid items-center px-6 py-10 md:px-8 md:py-12">
          <form className="grid gap-2.5" onSubmit={handleSubmit}>
            <label className="text-xs font-bold tracking-widest text-gray-500" htmlFor={userId}>
              USUARIO
            </label>
            <input
              id={userId}
              className="w-full h-11 rounded-[10px] border border-gray-200 px-3.5 text-sm bg-white text-gray-800 outline-none transition-[border-color,box-shadow] duration-120 focus:border-[#d23b3b]/60 focus:ring-4 focus:ring-[#d23b3b]/10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <label className="text-xs font-bold tracking-widest text-gray-500" htmlFor={passId}>
              CONTRASEÑA
            </label>
            <input
              id={passId}
              className="w-full h-11 rounded-[10px] border border-gray-200 px-3.5 text-sm bg-white text-gray-800 outline-none transition-[border-color,box-shadow] duration-120 focus:border-[#d23b3b]/60 focus:ring-4 focus:ring-[#d23b3b]/10"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              className="h-11 rounded-full border-0 bg-[#d23b3b] text-white font-extrabold tracking-widest cursor-pointer transition duration-80 hover:bg-[#b83232] active:translate-y-px"
              type="submit"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
