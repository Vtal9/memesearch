import React from 'react'
import { AuthState, FullMeme, InvisibleMeme, ForeignMeme, VisibleForeign } from '../../util/Types'
import { CircularProgress } from '@material-ui/core'
import MemeActions from '../actions/MemeActions'
import { makeVisible, isForeign, makeForeignVisible } from '../../util/Funcs'


type Props = {
  unloadedMeme: InvisibleMeme | ForeignMeme
  openDialog: (meme: FullMeme | VisibleForeign) => void
  authState: AuthState
  onDelete?: () => void
}

type State =
| { type: 'loading' }
| { type: 'done', meme: FullMeme | VisibleForeign }

export default class GalleryItem extends React.Component<Props, State> {
  state: State = {
    type: 'loading'
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.unloadedMeme !== this.props.unloadedMeme) {
      this.setState({ type: 'loading' })
      this.load()
    }
  }

  async load() {
    if (isForeign(this.props.unloadedMeme)) {
      this.setState({ type: 'done', meme: await makeForeignVisible(this.props.unloadedMeme) })
    } else {
      this.setState({ type: 'done', meme: await makeVisible(this.props.unloadedMeme) })
    }
  }

  openDialog() {
    if (this.state.type === 'done') {
      this.props.openDialog(this.state.meme)
    }
  }

  render() {
    return (
      this.state.type === 'loading' ? (
        <CircularProgress className='gallery-item' />
      ) : (
        <div className='gallery-item actions-holder'>
          <img src={this.state.meme.img.src}
            onClick={() => this.openDialog()}
          />
          <MemeActions authState={this.props.authState} meme={this.state.meme} edit />
        </div>
      )
    )
  }
}