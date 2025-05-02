import React, { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const RegisterUser = () => {
    const [values, setValues] = useState({
        user_name: '',
        password: '',
        img_url: null
    })

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.name === 'img_url' ? e.target.files[0] : e.target.value
        })
    }

    const { user_name, password, img_url } = values

    const registerMutate = useMutation({
        mutationKey: ['user'],
        mutationFn: async () => {
            const formData = new FormData()
            formData.append('user_name', user_name)
            formData.append('password', password)
            formData.append('profileImage', img_url)
            
            const res = await axios.post('http://localhost:3000/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return res.data
        },
        onSuccess: () => {
            console.log('created user')
            alert('file uploaded')
        },
        onError: () => {
            console.log('error occured')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        registerMutate.mutate()
    }

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input onChange={handleChange} type="text" value={user_name} name='user_name' />
                <label htmlFor="password">Password</label>
                <input onChange={handleChange} type="text" value={password} name='password' id='password' />
                <input onChange={handleChange} type="file" name='img_url' />

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default RegisterUser