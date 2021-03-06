import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import { logout } from '../../actions/auth'
const Navbar = (props) => {
    const authLinks = (
        <ul>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user" />{' '}
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <Link onClick={props.logout} to="/login">
                    <i className="fas fa-sign-out-alt" />{' '}
                    <span className="hide-sm">Logout</span>
                </Link>
            </li>
        </ul>
    )
    const guestLinks = (
        <ul>
            <li><Link to="#!">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )
    return (
        <div>
            <nav className="navbar bg-dark">
                <h1>
                    <Link to="/"><i className="fas fa-code"/> DevConnector</Link>
                </h1>
                {!props.auth.loading && (<>{props.auth.isAuthenticated ? authLinks : guestLinks}</>)}
            </nav>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logout})(Navbar)
