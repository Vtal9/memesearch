import React from 'react'
import { User } from '../util/Types'
import { Dialog, DialogContent, Grid, TextField, Button, Typography } from '@material-ui/core'
import { registerApi, loginApi } from '../api/Auth'


type LoginEvent = {
  u: User
  token: string
}

type Props = {
  dialog: 'none' | 'login' | 'register'
  closeMe: Function
  openRegister: Function
  handleLogin: (e: LoginEvent) => void
}

type State = {
  username: string
  password: string
  password2: string
  loading: boolean
  error: string | null
}

export default class AuthWindow extends React.Component<Props, State> {
  state: State = {
    username: '',
    password: '',
    password2: '',
    loading: false,
    error: null
  }

  loginSuccess(id: number, username: string, token: string) {
    this.props.handleLogin({
      u: { id, username },
      token
    })
    this.props.closeMe()
  }

  unsetError() {
    this.setState({ error: null })
  }

  setError(error: string) {
    this.setState({ error })
  }

  setLoading() {
    this.setState({ loading: true })
  }

  unsetLoading() {
    this.setState({ loading: false })
  }

  async handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    this.unsetError()
    const { username, password, password2 } = this.state
    if (username.trim() === '') {
      this.setError('Введите логин')
      return
    }
    if (password.trim() === '') {
      this.setError('Введите пароль')
      return
    }
    switch (this.props.dialog) {
    case 'login':
      this.setLoading()
      try {
        const result = await loginApi(username, password)
        if (result.ok) {
          this.loginSuccess(result.user.id, result.user.username, result.token)
        } else {
          this.setError('Неправильный логин или пароль')
        }
      } catch {
        this.setError('Нет Интернета')
      }
      this.unsetLoading()
      break
    case 'register':
      if (username.trim().length < 2) {
        this.setError('Логин должен иметь хотя бы 2 символа')
        return
      }
      if (password !== password2) {
        this.setError('Пароли не совпадают')
        return
      }
      this.setLoading()
      try {
        const result = await registerApi(username, password)
        if (result.ok) {
          this.loginSuccess(result.user.id, result.user.username, result.token)
          this.unsetLoading()
        } else {
          if (result.type === 'exists') {
            this.setError('Этот логин уже занят')
          } else {
            this.setError('Неизвестная ошибка')
          }
        }
      } catch {
        this.setError('Нет интернета')
      }
      this.unsetLoading()
      break
    }
  }

  render() {
    const { username, password, password2, loading, error } = this.state
    return (
      <Dialog open={this.props.dialog !== 'none'} onClose={() => this.props.closeMe()}>
        <DialogContent>
          <form onSubmit={e => this.handleSubmit(e)} style={{ maxWidth: 300, marginBottom: 8 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={username}
                  onChange={e => this.setState({ username: e.target.value })}
                  label='Логин'
                  fullWidth autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  label='Пароль' type='password' fullWidth
                />
              </Grid>
              {this.props.dialog === 'register' &&
                <Grid item xs={12}>
                  <TextField
                    value={password2}
                    onChange={e => this.setState({ password2: e.target.value })}
                    label='Повторите пароль' type='password' fullWidth
                  />
                </Grid>
              }
              {this.props.dialog === 'login' &&
                <Grid item xs={4}>
                  <Button
                    type='submit'
                    disabled={this.state.loading}
                    color='primary' variant='contained' fullWidth
                  >{loading ? 'Загрузка...' : 'Войти'}</Button>
                </Grid>
              }
              {this.props.dialog === 'login' &&
                <Grid item xs={8}>
                  <Button
                    onClick={() => this.props.openRegister()}
                    color='primary' fullWidth
                  >У меня нет аккаунта</Button>
                </Grid>
              }
              {this.props.dialog === 'register' &&
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    disabled={loading}
                    color='primary' variant='contained' fullWidth
                  >
                    {loading ? 'Загрузка...' : 'Создать аккаунт'}
                  </Button>
                </Grid>
              }
              {error !== null &&
                <Grid item xs={12}>
                  <Typography color='error'>{error}</Typography>
                </Grid>
              }
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
}