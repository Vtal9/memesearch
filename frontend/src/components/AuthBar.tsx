import React, { FormEvent } from 'react'
import Axios from 'axios'
import Funcs from '../util/Funcs';
import { AuthState, User } from '../util/Types';
import { Typography, Button, Dialog, DialogContent, Grid, TextField, Icon, MenuItem, MenuList, Popover } from '@material-ui/core'


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


interface LoginWindowProps {
  dialog: 'none' | 'login' | 'register'
  closeMe: Function
  openRegister: Function
  handleUser: (u: User) => void
}

function LoginWindow(props: LoginWindowProps) {
  const [ email, setEmail ] = React.useState('')
  const [ username, setUsername ] = React.useState('')
  const [ password, setPassword ] = React.useState('')
  const [ password2, setPassword2 ] = React.useState('')
  const [ loading, setLoading ] = React.useState(false)
  const [ error, setError ] = React.useState<null | string>(null)

  function loginSuccess(id: number, username: string, token: string) {
    props.handleUser({ id, username })
    Funcs.setToken(token)
    props.closeMe()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (username.trim() === '') {
      setError('Введите логин')
      return
    }
    if (password.trim() === '') {
      setError('Введите пароль')
      return
    }
    switch (props.dialog) {
    case 'login':
      setLoading(true)
      Axios.post('accounts/api/auth/login', { username, password }).then(response => {
        const { id, username } = response.data.user
        loginSuccess(id, username, response.data.token)
      }).catch(error => {
        if (error.response && error.response.data) {
          setError('Неправильный логин или пароль')
        } else {
          setError('Нет Интернета')
        }
        setLoading(false)
        return
      })
      break
    case 'register':
      if (!email.match(EMAIL_REGEX)) {
        setError('Введите корректный email')
        return
      }
      if (username.trim().length < 2) {
        setError('Логин должен иметь хотя бы 2 символа')
        return
      }
      if (password !== password2) {
        setError('Пароли не совпадают')
        return
      }
      setLoading(true)
      Axios.post('accounts/api/auth/register', { username, password, email }).then(response => {
        const { id, username } = response.data.user
        loginSuccess(id, username, response.data.token)
        setLoading(false)
      }).catch(error => {
        if (error.response && error.response.data && error.response.data.username) {
          setError('Этот логин уже занят')
        } else {
          setError('Нет интернета')
        }
        setLoading(false)
      })
      break
    }
  }

  return (
    <Dialog open={props.dialog !== 'none'} onClose={e => props.closeMe()}>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ maxWidth: 300, marginBottom: 8 }}>
          <Grid container spacing={2}>
            {props.dialog === 'register' &&
              <Grid item xs={12}>
                <TextField fullWidth label='Email' type='email' autoFocus={props.dialog === 'register'}
                  value={email} onChange={e => setEmail(e.target.value)} />
              </Grid>
            }
            <Grid item xs={12}>
              <TextField fullWidth label='Логин' autoFocus={props.dialog === 'login'}
                value={username} onChange={e => setUsername(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Пароль' type='password'
                value={password} onChange={e => setPassword(e.target.value)} />
            </Grid>
            {props.dialog === 'register' &&
              <Grid item xs={12}>
                <TextField fullWidth label='Повторите пароль' type='password'
                  value={password2} onChange={e => setPassword2(e.target.value)} />
              </Grid>
            }
            {props.dialog === 'login' &&
              <Grid item xs={4}>
                <Button color='primary' variant='contained' disabled={loading} fullWidth type='submit'>
                  {loading ? 'Загрузка...' : 'Войти'}
                </Button>
              </Grid>
            }
            {props.dialog === 'login' &&
              <Grid item xs={8}>
                <Button color='primary' fullWidth onClick={() => props.openRegister()}>У меня нет аккаунта</Button>
              </Grid>
            }
            {props.dialog === 'register' &&
              <Grid item xs={12}>
                <Button color='primary' variant='contained' disabled={loading} fullWidth type='submit'>
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


type AuthBarState = {
  dialog: 'none' | 'login' | 'register'
  userMenuAnchor: HTMLElement | null
}

interface AuthBarProps {
  authState: AuthState
  onAuthStateChange: (user: User | null) => void
}

export default class AuthBar extends React.Component<AuthBarProps, AuthBarState> {
  state: AuthBarState = {
    dialog: 'none',
    userMenuAnchor: null
  }

  componentDidMount() {
    Funcs.checkToken(u => {
      this.props.onAuthStateChange(u)
    }, () => {
      this.props.onAuthStateChange(null)
    })
  }

  openRegister() {
    this.setState(() => this.setState({ dialog: 'register' }))
  }

  render() {
    switch (this.props.authState.status) {
    case 'unknown':
      return (
        <Typography>...</Typography>
      )
    case 'no':
      return (
        <div>
          <Button color='primary' onClick={() => this.setState({ dialog: 'login' })}>Войти</Button>
          <LoginWindow dialog={this.state.dialog}
            openRegister={() => this.setState({ dialog: 'register' })}
            closeMe={() => this.setState({ dialog: 'none' })}
            handleUser={u => this.props.onAuthStateChange(u)} />
        </div>
      )
    case 'yes':
      return (
        <div>
          <Button color='primary' startIcon={<Icon>account_circle</Icon>}
            onClick={e => this.setState({ userMenuAnchor: e.currentTarget })}
          >{this.props.authState.user.username}</Button>
          <Popover open={this.state.userMenuAnchor !== null} anchorEl={this.state.userMenuAnchor}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose={() => this.setState({ userMenuAnchor: null })}
          >
            <MenuList>
              <MenuItem onClick={() => {
                location.href = '#/mymemes'
              }}>Коллекция</MenuItem>
              <MenuItem onClick={() => {
                Funcs.unsetToken()
                this.props.onAuthStateChange(null)
                this.setState({ userMenuAnchor: null })
              }}>Выйти</MenuItem>
            </MenuList>
          </Popover>
        </div>
      )
    }
  }
}