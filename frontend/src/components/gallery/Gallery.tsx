import React from 'react'
import { UnloadedMeme, AuthState } from '../../util/Types'
import { Dialog, DialogActions, Typography } from '@material-ui/core'
import GalleryItem from './Item'


type Props = {
  list: UnloadedMeme[]
  authState: AuthState
}

type State = {
  dialogImg: HTMLImageElement | null
}

export default class Gallery extends React.Component<Props, State> {
  state: State = {
    dialogImg: null
  }

  render() {
    return (
      <div className="gallery">
        <Dialog
          maxWidth={false}
          open={this.state.dialogImg !== null}
          onClose={() => this.setState({ dialogImg: null })}
        >
          {this.state.dialogImg !== null && [
            <img src={this.state.dialogImg.src} {...imageSize(this.state.dialogImg)} key={1} />,
            <DialogActions key={2}>
              <a href={this.state.dialogImg.src} target='_blank'>
                <Typography>Открыть оригинал</Typography>
              </a>
            </DialogActions>
          ]}
        </Dialog>
        {this.props.list.map(item => (
          <GalleryItem key={item.url} unloadedMeme={item}
            authState={this.props.authState}
            openDialog={(img: HTMLImageElement) => {
              this.setState({ dialogImg: img })
          }} />
        ))}
      </div>
    )
  }
}


function imageSize(img: HTMLImageElement) {
  const [ imgW, imgH ] = [ img.width, img.height ]
  const [ clientW, clientH ] = [ window.innerWidth, window.innerHeight ]
  const [ availableW, availableH ] = [ clientW - 64, clientH - 110 ]
  const scale = Math.min(1, availableW / imgW, availableH / imgH)
  return { width: imgW * scale, height: imgH * scale }
}