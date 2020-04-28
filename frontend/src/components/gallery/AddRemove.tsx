import React from 'react'
import { WithSnackbarProps, withSnackbar } from 'notistack'
import { User } from '../../util/Types'
import Axios from 'axios'
import { authHeader } from '../../util/Funcs'
import { IconButton, Icon } from '@material-ui/core'


type Props = WithSnackbarProps & {
  id: number
  own: boolean
  user: User
}

type State = {
  own: boolean
  disabled: boolean
}

class _AddRemove extends React.Component<Props, State> {
  state: State = {
    own: this.props.own,
    disabled: false
  }

  addDelete(method: 'add' | 'remove') {
    this.setState({ disabled: true })
    Axios.post(
      `api/configureOwnMemes?method=${method}&id=${this.props.id}`, {}, 
      {
        headers: authHeader()
      }
    ).then(response => {
      this.setState({ disabled: false, own: !this.state.own })
      this.props.enqueueSnackbar(
        method === 'remove' ? 'Мем удалён из вашей коллекции' : 'Мем добавлен в вашу коллекцию'
      )
    }).catch(error => {
      this.setState({ disabled: false })
    })
  }

  render() {
    return (
      <IconButton
        size='small'
        disabled={this.state.disabled}
        onClick={() => {
          this.addDelete(this.state.own ? 'remove' : 'add')
        }}
        title={this.state.own ? 'Удалить из своей коллекции' : 'Добавить в свою коллекцию'}
      ><Icon>{this.state.own ? 'delete' : 'add'}</Icon></IconButton>
    )
  }
}

export const AddRemove = withSnackbar(_AddRemove)

export const FakeAdd = withSnackbar((props: WithSnackbarProps) => (
  <IconButton
    size='small'
    title='Добавить в свою коллекцию'
    onClick={() => props.enqueueSnackbar('Авторизуйтесь, и вы сможете сохранять мемы в свою коллекцию')}
  ><Icon>add</Icon></IconButton>
))