import React from 'react'
import { IconButton, Icon, Dialog, DialogContent, DialogActions } from '@material-ui/core'
import TagsForm from '../TagsForm'


type Props = {
  id: number
}

type State = {
  dialogOpen: boolean
}

export class TagsEdit extends React.Component<Props, State> {
  state: State = {
    dialogOpen: false
  }

  close() {
    this.setState({ dialogOpen: false })
  }

  render() {
    return ([
      <IconButton
        size='small'
        title='Добавить тег'
        onClick={() => {
          this.setState({ dialogOpen: true })
        }}
        key={1}
      >
        <Icon>local_offer</Icon>
      </IconButton>,
      <Dialog
        open={this.state.dialogOpen}
        onClose={() => this.close()}
        key={2}
      >
        <DialogContent>
          <TagsForm id={this.props.id} onDone={() => this.close()} />
        </DialogContent>
        <DialogActions />
      </Dialog>
    ])
  }
}