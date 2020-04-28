import React from 'react'
import { WithSnackbarProps, withSnackbar } from 'notistack'
import { IconButton, Icon, DialogTitle, DialogContent, Dialog, DialogActions } from '@material-ui/core'
import DescriptionForm from '../DescriptionForm'


type Props = {
  id: number
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
        size='small'
        onClick={() => {
          this.setState({ dialogOpen: true })
        }}
        title='Доразметить'
        key={1}
      ><Icon>edit</Icon></IconButton>,
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