import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {addExperience} from './../../actions/profile'
const AddExperience = ({addExperience, history}) => {
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
    })

    const [toDateDisabled, setToDateDisabled] = useState(false)
    const {company, title, location, from, to, current, description} = formData

    const onChangeHandler = e => setFormData({...formData, [e.target.name] : e.target.value})
    const toggleDisabled = e => {
        setToDateDisabled(true)
    }
    const onSubmitHandler = (e) => {
        e.preventDefault()
        addExperience(formData, history)
    }
    return (
        <>
            <h1 className="large text-primary">
            Add An Experience
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
            </p>
            <small style={{'color' : 'red' }}>*required field</small>
            <form className="form" onSubmit={onSubmitHandler}>
                <div className="form-group">
                <input type="text" placeholder="* Job Title" name="title" 
                value={title} onChange={e => onChangeHandler(e)} required />
                </div>
                <div className="form-group">
                <input type="text" placeholder="* Company" name="company" 
                value={company} onChange={e => onChangeHandler(e)} required />
                </div>
                <div className="form-group">
                <input type="text" placeholder="Location" name="location" 
                value={location} onChange={e => onChangeHandler(e)} />
                </div>
                <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" 
                value={from} onChange={e => onChangeHandler(e)} />
                </div>
                <div className="form-group">
                <p><input type="checkbox" name="current" checked={current}
                value={current} onChange={e => {
                    setFormData({...formData, current: !current})
                    toggleDisabled(!toDateDisabled)
                }} 
                /> Current Job</p>
                </div>
                <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" disabled={toDateDisabled ? 'disabled' : ''}
                value={to} onChange={e => onChangeHandler(e)} />
                </div>
                <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Job Description"
                    value={description} onChange={e => onChangeHandler(e)}
                ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </>
    )
}

export default connect(null, {addExperience})(AddExperience)
