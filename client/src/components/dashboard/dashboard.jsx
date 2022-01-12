import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentProfile, deleteAccount} from '../../actions/profile'
import Spinner from '../layouts/Spinner'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'
const Dashboard = ({getCurrentProfile, deleteAccount, auth: {user}, profile: {profile, loading}}) => {
    useEffect(() => {
        getCurrentProfile()
    }, [])
    return loading && profile === null ? <Spinner /> : 
    <>
        <h1 className="large text-primary">Dashboard</h1>
        <p className='lead'> <i className='fas fa-user'></i>Welcome {user && user.name}</p>
        <>
            {profile !== null ? 
            <>
                <DashboardActions />
                <Experience experience={profile.experience}/>
                <Education education={profile.education}/>
                <div className='my-2'>
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-user-minus"></i> Delete My Account
                    </button>
                </div>
            </> 
            : 
            <>
                <p>You have not setup a profile, please add some info.</p>
                <Link to='/create-profile' className='btn btn-primary'>Create Profile</Link>
            </>}
        </>
    </>
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,

})
export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
