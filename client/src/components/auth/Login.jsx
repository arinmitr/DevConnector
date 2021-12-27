import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
export const Login = (props) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const { email, password} = formData

    const onChangeHandler = e => setFormData({ ...formData, [e.target.name]: e.target.value})

    const onSubmitHandler = e => {
        e.preventDefault()
        props.login({email, password})
    }
    if(props.isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <React.Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Log Into Your Account</p>
            <form className="form" onSubmit={onSubmitHandler}>
                <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" 
                value={email} onChange={e => onChangeHandler(e)}
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password}
                    onChange={e => onChangeHandler(e)}
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, ({login}))(Login)