import React from 'react'
import { AuthState, PureMeme, FullMeme } from '../../util/Types'
import GalleryItem from './Item'
import ModalMeme from '../../modals/Meme'

type Props = {
  list: PureMeme[]
  authState: AuthState
}

type State = {
  dialogMeme?: FullMeme
}

export default class Gallery extends React.Component<Props, State> {
  state: State = {}

  render() {
    return (
      <div className="gallery">
        <ModalMeme
          authState={this.props.authState}
          meme={this.state.dialogMeme}
          onClose={() => this.setState({ dialogMeme: undefined })}
        />
        {this.props.list.map(item => (
          <GalleryItem key={item.url} unloadedMeme={item}
            authState={this.props.authState}
            openDialog={meme => {
              this.setState({ dialogMeme: meme })
          }} />
        ))}
      </div>
    )
  }
}