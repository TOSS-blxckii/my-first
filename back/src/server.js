import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import db from '../database/database.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use('/image', express.static('Public/Profiles')) // fixed path to match upload destination

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Public/Profiles') // stores image in ./Public
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) // creates unique filename
    }
})

const upload = multer({ storage })
app.get('/home',(req,res)=>{
    const q = 'select * from image'
    db.query(q,(error,data)=>{
        const BASE_url = process.env.BASE_URL
        const update = data.map((i)=>({
            ...i,
            img:`${BASE_url}${i.img}`
        }))
        return res.status(200).json(update)
    })
})

app.post('/image', upload.single('img'), (req, res) => {
    const img = req.file?.filename // fixed destructuring

    if (!img) {
        return res.status(404).json('missing img')
    }

    const q = 'INSERT INTO image (`img`) VALUES (?)'
    const values = [img]

    db.query(q, values, (error, data) => {
        if (error) return res.status(400).json(error)

        const BASE_url = process.env.BASE_URL
        const imgUrl = `${BASE_url}/image/${img}` // fixed full image URL

        return res.status(201).json({ message: 'Image uploaded', imgUrl })
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
