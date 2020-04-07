import React, { FormEvent } from 'react'
import Axios from 'axios'
import Funcs from '../util/Funcs';
import Types from '../util/Types';
import { Typography, Button, Dialog, DialogContent, Grid, TextField, Icon, Menu, MenuItem, ClickAwayListener, MenuList, Popper, Popover } from '@material-ui/core';


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

interface LoginWindowProps {
  dialog: 'none' | 'login' | 'register',
  closeMe: Function,
  openRegister: Function
  handleUser: (u: Types.User) => void
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
    Funcs.setAuth(token)
    setLoading(false)
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
        setLoading(false)
        setError('Неправильный логин или пароль')
      })
      break
    case 'register':
      if (!email.match(EMAIL_REGEX)) {
        setError('Введите корректный email')
        return
      }
      if (username.length < 4) {
        setError('Логин должен иметь хотя бы 4 символа')
        return
      }
      if (password.length < 6) {
        setError('Пароль должен иметь хотя бы 6 символов')
        return
      }
      if (password !== password2) {
        setError('Пароли не совпадают')
        return
      }
      Axios.post('accounts/api/auth/register', { username, password, email }).then(response => {
        const { id, username } = response.data.user
        loginSuccess(id, username, response.data.token)
      }).catch(error => {
        setLoading(false)
        setError('Нет интернета')
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
                <TextField fullWidth label='Email' type='email'
                  value={email} onChange={e => setEmail(e.target.value)} />
              </Grid>
            }
            <Grid item xs={12}>
              <TextField fullWidth label='Логин' autoFocus
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
                <Button color='primary' variant='contained' disabled={loading} fullWidth type='submit'>Войти</Button>
              </Grid>
            }
            {props.dialog === 'login' &&
              <Grid item xs={8}>
                <Button color='primary' fullWidth onClick={() => props.openRegister()}>У меня нет аккаунта</Button>
              </Grid>
            }
            {props.dialog === 'register' &&
              <Grid item xs={12}>
                <Button color='primary' variant='contained' disabled={loading} fullWidth type='submit'>Создать аккаунт</Button>
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


interface AuthState {
  status: 'loading' | 'done'
  u: Types.User | null
  dialog: 'none' | 'login' | 'register'
  userMenuAnchor: HTMLElement | null
}

export default class AuthBar extends React.Component<{}, AuthState> {
  constructor() {
    super({})
    this.state = {
      status: 'loading',
      u: null,
      dialog: 'none',
      userMenuAnchor: null
    }
  }

  setDone(u: Types.User | null) {
    this.setState({ status: 'done', u })
  }

  componentDidMount() {
    Funcs.checkAuth((u: Types.User) => this.setDone(u), () => this.setDone(null))
  }

  render() {
    return (
      this.state.status === 'loading' ?
        <Typography>...</Typography>
      :
        this.state.u === null ?
          <div>
            <Button color='primary' onClick={() => this.setState({ dialog: 'login' })}>Войти</Button>
            <LoginWindow dialog={this.state.dialog}
              openRegister={() => this.setState({ dialog: 'register' })}
              closeMe={() => this.setState({ dialog: 'none' })}
              handleUser={u => this.setDone(u)} />
          </div>
        :
          <div>
            <Button color='primary' startIcon={<Icon>account_circle</Icon>}
              onClick={e => this.setState({ userMenuAnchor: e.currentTarget })}
            >{this.state.u.username}</Button>
            <Popover open={this.state.userMenuAnchor !== null} anchorEl={this.state.userMenuAnchor}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <MenuList>
                <MenuItem onClick={() => {
                  Funcs.unsetAuth()
                  this.setState({ u: null, userMenuAnchor: null })
                }}>Выйти</MenuItem>
              </MenuList>
            </Popover>
          </div>
    )
  }
}