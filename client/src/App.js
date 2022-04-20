
import './App.css';
import React, { Component } from 'react'
import {
  BrowserRouter as Router,
Routes,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux'
import store from './store'



import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Landing from './components/Layout/Landing'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'



 class App extends Component {
   
  render() {
    return (
<Provider store={store}>
  
      <Router>
       
      <div className="App">
       
     
        <Navbar />
        
        <Routes>
         <Route exact path='/' element={<Landing/>} />
         <Route exact path='/register' element={<Register/>} />
         <Route exact path='/login' element={<Login/>} />
      </Routes>
         
        
      </div>
      <Footer />
      </Router>
      </Provider>
    )
  }
}

export default App;
