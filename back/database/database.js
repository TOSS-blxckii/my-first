import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql2.createConnection({
  database:process.env.DATABASE,
  host:process.env.HOST,
  password:process.env.PASSWORD,
  user:process.env.USER
})
db.connect((error)=>{
  if(error){
    console.log(error)
  }
  else{
    console.log('connected to the database')
  }
 
})

export default db