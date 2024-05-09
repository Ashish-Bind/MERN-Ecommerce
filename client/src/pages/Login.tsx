import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { auth } from '../firebase.config'
import { useLoginMutation } from '../redux/api/user'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { MessageResponse } from '../types'
import { userExist } from '../redux/reducer/userReducer'

const Login = () => {
  const [gender, setGender] = useState<string>('')
  const [dob, setDob] = useState('')

  const [login] = useLoginMutation()

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)

      const res = await login({
        _id: user.uid,
        name: user.displayName!,
        photo: user.photoURL!,
        dob,
        gender,
        email: user.email!,
        role: 'user',
      })

      if ('data' in res) {
        userExist({
          _id: user.uid,
          name: user.displayName!,
          photo: user.photoURL!,
          dob,
          gender,
          email: user.email!,
          role: 'user',
        })
        toast.success(res.data.message)
      } else {
        const error = res.error as FetchBaseQueryError
        const { message } = error.data as MessageResponse
        toast.error(message)
      }
    } catch (error) {
      toast.error('Login failed')
    }
  }

  return (
    <div className="login">
      <main>
        <h1>Login</h1>

        <div>
          <label htmlFor="gender-select">Gender</label>
          <select
            title="Gender"
            id="gender-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div>
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div>
          <span>Already signed in </span>
          <button onClick={loginHandler}>
            <FcGoogle /> Continue with google
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login
