import React, { useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'

const RegisterUser = () => {
    const [img, setImg] = useState(null) // single image file

    // Fetch existing images from DB
    const { data: images } = useQuery({
        queryKey: ['images'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/home')
            console.log(res.data)
            return res.data
        }
    })

    // Handle image upload
    const registerMutate = useMutation({
        mutationKey: ['user'],
        mutationFn: async (formData) => {
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
            console.log('error occurred')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!img) return alert('Please select an image')
        const formData = new FormData()
        formData.append('img', img)
        registerMutate.mutate(formData)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} encType='multipart/form-data'>
                <input
                    type="file"
                    name="img"
                    accept="image/*" // optional: restrict file input to images
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <button type="submit">Submit</button>
            </form>

            <div>
                {Array.isArray(images) && images.map((img) => (
                    <div key={img.img_id}>
                        <img
                            src={img.img}
                            alt="uploaded preview"
                            width="200"
                            style={{ margin: '10px' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RegisterUser
