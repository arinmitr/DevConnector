import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layouts/Navbar'
import Landing from './components/layouts/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Alert from './components/layouts/Alert'
import Dashboard from './components/dashboard/dashboard'
import PrivateRoute from './routing/PrivateRoute'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'
//Redux
import { Provider } from 'react-redux'
import store from './store/store'

import './App.css'

const App = () => {
    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token)
        }
        store.dispatch(loadUser())
    })
    return (
        <Provider store={store}>
            <Router>
                <React.Fragment>
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <section className="container">
                        <Alert />
                        <Switch>
                            <Route
                                exact
                                path="/register"
                                component={Register}
                            />
                            <Route exact path="/login" component={Login} />
                            <PrivateRoute
                                exact
                                path="/dashboard"
                                component={Dashboard}
                            />
                        </Switch>
                    </section>
                </React.Fragment>
            </Router>
        </Provider>
    )
}

export default App
