import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { register } from '../../Actions/auth'

export class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password2: ''
    }

    onSubmit = e => {
        e.preventDefault();
        const {username, email, password, password2} = this.state;
        if (password == password2) {
            const newUser = {
                username,
                password,
                email
            }
            this.props.register(newUser);
        }
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/profile" />
        }
        const { username, email, password, password2 } = this.state;
        return (
            <div>
                <div id="wrapper" />
                <div className="user-icon" />
                <div className="pass-icon" />
	
                <form name="login-form" className="login-form" onSubmit={this.onSubmit}>

                    <div className="header">
                        <h1>Регистрация</h1>
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
                            name="email" 
                            type="email" 
                            className="input email" 
                            value={email} 
                            onChange={this.onChange}
                            placeholder="Ведите email"
                        />
                        <input 
                            name="password" 
                            type="password" 
                            className="input password"
                            onChange={this.onChange}
                            value={password}
                            placeholder="Ведите пароль"
                        />
                        <input 
                            name="password2" 
                            type="password" 
                            className="input password"
                            onChange={this.onChange}
                            value={password2}
                            placeholder="Повторите пароль"
                        />
                    </div>

                    <div className="footer">
                        <input type="submit" name="submit" value="Зарегистрироваться" className="button" onClick={this.onSubmit}/>
                        <Link to='/login' className="register">Войти</Link>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated 
})

export default connect(mapStateToProps, { register })(Register)
