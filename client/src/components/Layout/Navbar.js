import React, { Component } from 'react'
import {Link} from 'react-router-dom'

 class Navbar extends Component {
    render() {
        return (
           <nav className="navbar bg-dark">
      <h1>
        <Link to="/"> DevConnector</Link>
      </h1>
      <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
    
        )
    }
}

export default Navbar;