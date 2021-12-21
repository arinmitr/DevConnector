import React, {useState} from 'react'
import {Link} from 'react-router-dom'
export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const { email, password} = formData

    const onChangeHandler = e => setFormData({ ...formData, [e.target.name]: e.target.value})

    const onSubmitHandler = async e => {
        e.preventDefault()
        
            console.log('SUCCESS');
        
    }
    return (
        <React.Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Log Into Your Account</p>
            <form className="form" onSubmit={e => onSubmitHandler(e)}>
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

export default Login