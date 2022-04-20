import React, { Component } from 'react'


import PropTypes from 'prop-types'

import classnames from 'classnames'
import { connect } from 'react-redux'
import { registerUser } from '../../actions/authActions'

class Register extends Component {
  constructor(){
    super();
    
    this.state= {
      name:'',
      email:'',
      password:'',
      password2:'',
      errors :{}
    }
    this.onChange=this.onChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors:nextProps.errors});
    }
  }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});

  }
  onSubmit(e){
    e.preventDefault();
    const newUser = {
      name:this.state.name,
      email:this.state.email,
      password:this.state.password,
      password2:this.state.password2,
    };
    this.props.registerUser(newUser,this.props.history);
   
  }
 
    render() {
          
        const {errors} = this.state;

       
      
        // const errors = this.state.err
        return (
            <section className="container">
             
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <input type="text" className={classnames('form-control',{'is-invalid':errors.name})} placeholder="Name" name="name" value={this.state.name} onChange={this.onChange}/>
              {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
              </div>
              <div className="form-group">
                <input type="email" className={classnames('form-control',{'is-invalid':errors.email})} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                <small className="form-text">This site uses Gravatar so if you want a profile image, use a
                  Gravatar email</small>
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  className={classnames('form-control',{'is-invalid':errors.password})}
                  name="password"
                  minLength="6"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={classnames('form-control',{'is-invalid':errors.password2})}
                  name="password2"
                  minLength="6"
                  value={this.state.password2}
                  onChange={this.onChange}
                />
                {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
              </div>
              <input type="submit" className="btn btn-primary" />
            </form>
            <p className="my-1">
              Already have an account? <a href="login.html">Sign In</a>
            </p>
          </section>
        )
    }
}
Register.propTypes = {
  registerUser:PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired,
  errors:PropTypes.object.isRequired
}
const mapStatetoProps = (state) =>({
  auth:state.auth,
  errors :state.errors
});
export default connect(mapStatetoProps,{registerUser})(Register);
