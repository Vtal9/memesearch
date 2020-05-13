import React from 'react'
import { WithSnackbarProps, withSnackbar } from 'notistack'
import { IconButton, DialogTitle, DialogContent, Dialog, DialogActions } from '@material-ui/core'
import DescriptionForm from '../forms/Description'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';


type Props = {
  id: number
  size: 'small' | 'medium'
} & WithSnackbarProps

type State = {
  dialogOpen: boolean
}

class _ExtraMarkup extends React.Component<Props, State> {
  state: State = {
    dialogOpen: false
  }

  render() {
    return ([
      <IconButton
        size={this.props.size}
        onClick={() => {
          this.setState({ dialogOpen: true })
        }}
        title='Доразметить'
        key={1}
      ><EditOutlinedIcon /></IconButton>,
      <Dialog
        key={2}
        open={this.state.dialogOpen}
        onClose={() => this.setState({ dialogOpen: false })}
      >
        <DialogTitle>Добавление разметки к уже имеющейся</DialogTitle>
        <DialogContent>
          <DescriptionForm
            memeId={this.props.id}
            autofocus={true}
            onDone={() => {
              this.setState({ dialogOpen: false })
            }}
            concat={true}
          />
        </DialogContent>
        <DialogActions />
      </Dialog>
    ])
  }
}

export const ExtraMarkup = withSnackbar(_ExtraMarkup)

export const FakeMarkup = withSnackbar((props: WithSnackbarProps & { size: 'small' | 'medium' }) => (
  <IconButton
    size={props.size}
    onClick={() => props.enqueueSnackbar('Нужна авторизация')}
    title='Доразметить'
  ><EditOutlinedIcon /></IconButton>
))