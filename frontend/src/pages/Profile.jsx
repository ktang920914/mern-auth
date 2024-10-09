import React, { useEffect, useRef, useState } from 'react'
import useUserstore from '../store'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'

const Profile = () => {

    const {currentUser, loading, error,
            updateStart, updateSuccess, updateFailure,
            deleteStart, deleteSuccess, deleteFailure,
            signOutSuccess} = useUserstore()
    const fileRef = useRef(null)
    const [image,setImage] = useState(null)
    const [imagePercent,setImagePercent] = useState(0)
    const [imageError,setImageError] = useState(false)
    const [formData,setFormData] = useState({})
    const [updateSuccessMsg,setUpdateSuccessMsg] = useState(false)

    useEffect(() => {
        if (image) {
          handleFileUpload(image);
        }
      }, [image])

      const handleFileUpload = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent(Math.round(progress));
          },
          (error) => {
            setImageError(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              setFormData({ ...formData, profilePicture: downloadURL })
            )
          }
        )
      }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            updateStart()
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(data.success === false){
                updateFailure(data.message)
            }
            if(data.success !== false){
                updateSuccess(data)
                setUpdateSuccessMsg(true)
            }
        } catch (error) {
            updateFailure(error.message)
        }
    }

    const handleDelete = async () => {
        try {
            deleteStart()
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method: 'DELETE',
            })
            const data = await res.json()
            if(data.success === false){
                deleteFailure(data.message)
            }
            if(data.success !== false){
                deleteSuccess(data)
            }
        } catch (error) {
            deleteFailure(error.message)
        }
    }

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/auth/signout' , {
                method: 'POST',
            })
            const data = await res.json()
            if(data.success === false){
                console.log(data.message)
            }
            if(data.success !== false){
                signOutSuccess(data)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
      <img
        src={formData.profilePicture || currentUser.profilePicture}
        alt='profile'
        onClick={() => fileRef.current.click()}
        className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
      />
       <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
            Error uploading image (file size must be less than 2 MB)
          </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
      <input
        defaultValue={currentUser.username}
        type='text'
        id='username'
        placeholder='Username'
        className='bg-slate-100 rounded-lg p-3'
        onChange={handleChange}
      />
      <input
        defaultValue={currentUser.email}
        type='email'
        id='email'
        placeholder='Email'
        className='bg-slate-100 rounded-lg p-3'
        onChange={handleChange}
      />
      <input
        type='password'
        id='password'
        placeholder='Password'
        className='bg-slate-100 rounded-lg p-3'
        onChange={handleChange}
      />
      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
      {loading ? 'Loading...' : 'Update'}
        </button>
    </form>
    <div className="flex justify-between mt-5">
      <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
      <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
    </div>
    <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccessMsg && 'User is updated successfully!'}
      </p>
  </div>
  )
}

export default Profile