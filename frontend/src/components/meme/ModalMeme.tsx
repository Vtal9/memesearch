import React from 'react'
import { Dialog, DialogActions, Typography } from '@material-ui/core'
import { FullMeme } from '../../util/Types'
import Voting from '../Voting'


type Props = {
  meme?: FullMeme
  onClose?: () => void
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
          <DialogActions key={2}>
            <Voting id={this.props.meme.id} />
            <a href={this.props.meme.img.src} target='_blank'>
              <Typography>Открыть оригинал</Typography>
            </a>
          </DialogActions>
        ]}
      </Dialog>
    )
  }
}


function imageSize(img: HTMLImageElement) {
  const [ imgW, imgH ] = [ img.width, img.height ]
  const [ clientW, clientH ] = [ window.innerWidth, window.innerHeight ]
  const [ availableW, availableH ] = [ clientW - 64, clientH - 125 ]
  const scale = Math.min(1, availableW / imgW, availableH / imgH)
  return { width: imgW * scale, height: imgH * scale }
}