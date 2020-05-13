import React from 'react'
import { Dialog, DialogActions } from '@material-ui/core'
import { FullMeme, AuthState } from '../util/Types'
import Voting from '../components/actions/Voting'
import MemeActions from '../components/actions/MemeActions'


type Props = {
  meme?: FullMeme
  onClose?: () => void
  authState: AuthState
}

export default class ModalMeme extends React.Component<Props> {
  render() {
    return (
      <Dialog
        maxWidth={false}
        open={this.props.meme !== undefined}
        onClose={this.props.onClose}
      >
        {this.props.meme !== undefined && [
          <img src={this.props.meme.img.src} {...imageSize(this.props.meme.img)} key={1} />,
          <DialogActions className='meme-footer' key={2}>
            <Voting id={this.props.meme.id} />
            <MemeActions authState={this.props.authState} meme={this.props.meme} big />
          </DialogActions>
        ]}
      </Dialog>
    )
  }
}


function imageSize(img: HTMLImageElement) {
  const [ imgW, imgH ] = [ img.width, img.height ]
  const [ clientW, clientH ] = [ window.innerWidth, window.innerHeight ]
  const [ availableW, availableH ] = [ clientW - 64, clientH - 130 ]
  const scale = Math.min(1, availableW / imgW, availableH / imgH)
  return { width: imgW * scale, height: imgH * scale }
}