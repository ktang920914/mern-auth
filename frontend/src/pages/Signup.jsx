import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useUserstore from '../store'
import Oauth from '../compoenents/Oauth'

const Signup = () => {

    const [formData,setFormData] = useState({})
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError(null)
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(data.success === false){
                setError(data.message)
                setLoading(false)
            }
            if(data.success !== false){
                setError(null)
                setLoading(false)
                navigate('/sign-in')
            }
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange} 
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange} 
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange} 
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}</button>
        <Oauth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error}</p>
    </div>
  )
}

export default Signup