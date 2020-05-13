import React from 'react'
import { AuthState } from '../../util/Types';
import { Typography, Button, Icon, MenuItem, MenuList, Popover, Divider } from '@material-ui/core'
import Token from '../../util/Token';
import AuthWindow from './Modal';
import Path from '../../util/Path';
import { pages } from '../../App';


type State = {
  dialog: 'none' | 'login' | 'register'
  userMenuAnchor: HTMLElement | null
}

type Props = {
  authState: AuthState
  onAuthStateChange: (user: AuthState) => void
}

export default class AuthBar extends React.Component<Props, State> {
  state: State = {
    dialog: 'none',
    userMenuAnchor: null
  }

  async componentDidMount() {
    try {
      this.props.onAuthStateChange({
        status: 'yes',
        user: await Token.check(),
        token: Token.get() as string
      })
    } catch {
      this.props.onAuthStateChange({
        status: 'no'
      })
    }
  }

  switchTo(path: string) {
    this.setState({ userMenuAnchor: null })
    location.href = '#' + path
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
        <div className='auth-bar'>
          <Button 
            color='primary'
            onClick={() => this.setState({ dialog: 'login' })}
            variant='outlined'
          >Войти</Button>
          <AuthWindow
            dialog={this.state.dialog}
            openRegister={() => this.setState({ dialog: 'register' })}
            closeMe={() => this.setState({ dialog: 'none' })}
            handleLogin={e => {  
              Token.set(e.token)
              this.props.onAuthStateChange({
                status: 'yes',
                user: e.u,
                token: e.token
              })
            }} />
        </div>
      )
    case 'yes':
      return (
        <div className='auth-bar'>
          <Button
            color='primary'
            variant='outlined'
            startIcon={<Icon>account_circle</Icon>}
            endIcon={<Icon>expand_more</Icon>}
            onClick={e => this.setState({ userMenuAnchor: e.currentTarget })}
          >{''}</Button>
          <Popover
            open={this.state.userMenuAnchor !== null}
            anchorEl={this.state.userMenuAnchor}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose={() => this.setState({ userMenuAnchor: null })}
          >
            <MenuList>
              {pages.filter(page => page.location === 'authbar').map(page => (
                <MenuItem key={page.url} onClick={() => this.switchTo(page.url)}>{page.title}</MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={() => {
                Token.unset()
                this.props.onAuthStateChange({ status: 'no' })
                this.setState({ userMenuAnchor: null })
              }}>Выйти</MenuItem>
            </MenuList>
          </Popover>
        </div>
      )
    }
  }
}