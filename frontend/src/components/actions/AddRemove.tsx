import React from 'react'
import { WithSnackbarProps, withSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import { addOrRemove } from '../../api/AddOrRemove'
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';


type Props = WithSnackbarProps & {
  id: number
  own: boolean
  size: 'small' | 'medium'
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

  async addOrRemove(method: 'add' | 'remove') {
    this.setState({ disabled: true })
    try {
      await addOrRemove(method, this.props.id)
      this.setState({ disabled: false, own: !this.state.own })
      this.props.enqueueSnackbar(
        method === 'remove' ? 'Мем удалён из вашей коллекции' : 'Мем добавлен в вашу коллекцию'
      )
    } catch {
      this.setState({ disabled: false })
    }
  }

  render() {
    return (
      <IconButton
        className='gtm-collection'
        size={this.props.size}
        disabled={this.state.disabled}
        onClick={() => {
          this.addOrRemove(this.state.own ? 'remove' : 'add')
        }}
        title={this.state.own ? 'Удалить из своей коллекции' : 'Добавить в свою коллекцию'}
      >{this.state.own ? <DeleteOutlinedIcon /> : <AddIcon />}</IconButton>
    )
  }
}

export const AddRemove = withSnackbar(_AddRemove)

export const FakeAdd = withSnackbar((props: WithSnackbarProps & { size: 'small' | 'medium' }) => (
  <IconButton
    className='gtm-collection'
    size={props.size}
    title='Добавить в свою коллекцию'
    onClick={() => props.enqueueSnackbar('Авторизуйтесь, и вы сможете сохранять мемы в свою коллекцию')}
  ><AddIcon /></IconButton>
))