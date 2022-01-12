import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {addEducation} from './../../actions/profile'
const AddEducation = ({addEducation, history}) => {
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
    })

    const [toDateDisabled, setToDateDisabled] = useState(false)
    const {institution, degree, fieldofstudy, from, to, current, description} = formData

    const onChangeHandler = e => setFormData({...formData, [e.target.name] : e.target.value})
    const toggleDisabled = () => {
        setToDateDisabled(!toDateDisabled)
    }
    const onSubmitHandler = (e) => {
        e.preventDefault()
        addEducation(formData, history)
    }
    return (
        <>
            <h1 className="large text-primary">
            Add An Education
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any degree or bootcamps
            </p>
            <small style={{'color' : 'red' }}>*required field</small>
            <form className="form" onSubmit={onSubmitHandler}>
                <div className="form-group">
                <input type="text" placeholder="* Degree" name="degree" 
                value={degree} onChange={e => onChangeHandler(e)} required />
                </div>
                <div className="form-group">
                <input type="text" placeholder="* Institution" name="institution" 
                value={institution} onChange={e => onChangeHandler(e)} required />
                </div>
                <div className="form-group">
                <input type="text" placeholder="Field of Study" name="fieldofstudy" 
                value={fieldofstudy} onChange={e => onChangeHandler(e)} />
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
                    toggleDisabled()
                }} 
                /> Current Institution</p>
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
                    placeholder="Description"
                    value={description} onChange={e => onChangeHandler(e)}
                ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </>
    )
}

export default connect(null, {addEducation})(AddEducation)
