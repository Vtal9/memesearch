import React from 'react'
import { AuthState, FullMeme, InvisibleMeme, ForeignMeme, VisibleForeign } from '../../util/Types'
import GalleryItem from './Item'
import ModalMeme from '../../modals/Meme'
import { isForeign, isNative } from '../../util/Funcs'

type Props = {
  list: (InvisibleMeme | ForeignMeme)[]
  authState: AuthState
}

type State = {
  dialogMeme?: FullMeme | VisibleForeign
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
          <GalleryItem key={key(item)} unloadedMeme={item}
            authState={this.props.authState}
            openDialog={meme => {
              this.setState({ dialogMeme: meme })
          }} />
        ))}
      </div>
    )
  }
}

function key(item: InvisibleMeme | ForeignMeme) {
  return isNative(item) ? item.id + item.url : item.url
}