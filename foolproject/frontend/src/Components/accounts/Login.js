import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../Actions/auth';

export class Login extends Component {
    state = {
        username: '',
        password: ''
    }

    onSubmit = e => {
        e.preventDefault(); 
        this.props.login(this.state.username, this.state.password)
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/profile" />
        }
        const { username, password } = this.state;
        return (
            <div>
                <div id="wrapper" />
                <div className="user-icon" />
                <div className="pass-icon" />
	
                <form name="login-form" className="login-form" onSubmit={this.onSubmit}>

                    <div className="header">
                        <h1>Вход</h1>
                    </div>

                    <div className="content">
                        <input 
                            name="username" 
                            type="text" 
                            className="input username" 
                            value={username} 
                            onChange={this.onChange} 
                            placeholder="Ведите логин"
                        />
                        <input 
                            name="password" 
                            type="password" 
                            className="input password"
                            onChange={this.onChange}
                            value={password}
                            placeholder="Ведите пароль"
                        />
                    </div>

                    <div className="footer">
                        <input type="submit" name="submit" value="ВОЙТИ" className="button" />
                        <Link to='/register' className="register">Регистрация</Link>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated 
})

export default connect(mapStateToProps, { login })(Login)
