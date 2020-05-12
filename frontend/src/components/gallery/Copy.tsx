import React from 'react'
import { WithSnackbarProps, withSnackbar } from 'notistack'
import { IconButton, Icon } from '@material-ui/core'


type Props = {
  img: HTMLImageElement
} & WithSnackbarProps

type State = {
  disabled: boolean
}

class _Copy extends React.Component<Props, State> {
  state: State = {
    disabled: false
  }

  async copy() {
    this.setState({ disabled: true })
    try {
      const cors_proxy = 'https://cors-anywhere.herokuapp.com/'
      let img: Response
      try {
        img = await fetch(this.props.img.src)
      } catch (e) {
        img = await fetch(cors_proxy + this.props.img.src)
      }
      let blob = await img.blob()
      const ClipboardItem: any = window['ClipboardItem' as any]
      if (blob.type !== 'image/png') {
        blob = await convertToPng(blob)
      }
      await (navigator.clipboard as any).write([
        new ClipboardItem({
            [blob.type]: blob
        })
      ]);
      this.setState({ disabled: false })
      this.props.enqueueSnackbar('Скопировано в буфер обмена')
    } catch (error) {
      this.setState({ disabled: false })
      console.log(error)
      this.props.enqueueSnackbar('Не удалось скопировать, но вы можете сделать это вручную')
    }
  }

  render() {
    return (
      <IconButton
        disabled={this.state.disabled}
        size='small'
        onClick={() => this.copy()}
        title='Копировать в буфер обмена'
      ><Icon>file_copy</Icon></IconButton>
    )
  }
}

export const Copy = withSnackbar(_Copy)


function convertToPng(imgBlob: Blob) {
  const imageUrl = window.URL.createObjectURL(imgBlob)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  const imageEl = new Image()
  return new Promise<Blob>((resolve, reject) => {
    imageEl.onload = e => {
      const target = e.target as HTMLImageElement
      canvas.width = target.width;
      canvas.height = target.height;
      ctx.drawImage(target, 0, 0, target.width, target.height);
      canvas.toBlob(blob => {
        if (blob !== null) {
          resolve(blob)
        } else {
          reject()
        }
      }, "image/png", 1);
    }
    imageEl.onerror = e => {
      console.log(e)
      reject()
    }
    imageEl.src = imageUrl
  })
}