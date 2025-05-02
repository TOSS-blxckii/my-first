import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Post from './Pages/post/Post'
import Messenger from './Pages/messenger/Messenger'
import RegisterUser from './Pages/registerUser/RegisterUser'

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/post' element={<Post/>}/>
        <Route path='/Messenger' element={<Messenger/>}/>
        <Route path='/registeruser' element={<RegisterUser/>}/>
      </Routes>
    </Router>
  )
}

export default App