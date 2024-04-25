import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')

  return (
    <div className="login">
      <main>
        <h1>Login</h1>

        <div>
          <label htmlFor="gender-select">Gender</label>
          <select title="Gender" id="gender-select">
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div>
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" />
        </div>

        <div>
          <span>Already signed in </span>
          <button>
            <FcGoogle /> Continue with google
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login
