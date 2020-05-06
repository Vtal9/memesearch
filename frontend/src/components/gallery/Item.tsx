import React from 'react'
import { AuthState, FullMeme, PureMeme } from '../../util/Types'
import { pureToFull } from '../../util/Funcs'
import { CircularProgress } from '@material-ui/core'
import { AddRemove, FakeAdd } from './AddRemove'
import { Copy } from './Copy'
import { ExtraMarkup, FakeMarkup } from './ExtraMarkup'
import { TagsEdit, FakeTagsEdit } from './TagsEdit'


type Props = {
  unloadedMeme: PureMeme
  openDialog: (meme: FullMeme) => void
  authState: AuthState
  onDelete?: () => void
}

type State =
| { type: 'loading' }
| { type: 'done', meme: FullMeme }

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
    this.setState({ type: 'done', meme: await pureToFull(this.props.unloadedMeme) })
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
        <div className='gallery-item'>
          <img src={this.state.meme.img.src}
            onClick={() => this.openDialog()}
          />
          {this.props.authState.status === 'yes' ? (
            <div className='actions'>
              <AddRemove
                user={this.props.authState.user}
                id={this.state.meme.id}
                own={this.state.meme.owner.some(owner => 
                  this.props.authState.status === 'yes' &&
                  this.props.authState.user.id === owner.id
                )}
              />
              <Copy img={this.state.meme.img} />
              <ExtraMarkup
                id={this.state.meme.id}
              />
              <TagsEdit id={this.state.meme.id} />
            </div>
          ) : (
            <div className="actions">
              <FakeAdd />
              <Copy img={this.state.meme.img} />
              <FakeMarkup />
              <FakeTagsEdit />
            </div>
          )}
        </div>
      )
    )
  }
}