import React from 'react'
import { app } from '../firebase'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import useUserstore from '../store'

const Oauth = () => {

    const {signInSuccess} = useUserstore()
    const auth = getAuth(app)
    const navigate = useNavigate()

    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            if (data.success !== false){
                signInSuccess(data)
                navigate('/')
            }
        } catch (error) {
            console.log(error.message)
        }
    } 
  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  )
}

export default Oauth