/**
 * Slightly modified React Gluejar library
 * https://github.com/charliewilco/react-gluejar
 * We do not own anything
 */


import React from 'react'


export interface GluejarProps {
  onPaste: (images: File[]) => void
  onError: (error: string) => void
  acceptedFiles: string[]
}

type BlobLikeFile = File | null

export default class Gluejar extends React.Component<GluejarProps, {}> {
  static displayName = 'Gluejar'

  static defaultProps = {
    onPaste: () => null,
    errorHandler: () => null,
    acceptedFiles: ['image/gif', 'image/png', 'image/jpeg', 'image/bmp']
  }

  state = {
    images: []
  }

  isValidFormat = (fileType: string): boolean => this.props.acceptedFiles.indexOf(fileType) !== -1

  pasteHandler = (e: ClipboardEvent) => this.checkPasted(e, this.props.onPaste)

  transformImages = (data: DataTransfer, cb: (images: File[]) => void) => {
    // NOTE: This needs to be a for loop, it's a list like object
    const response: File[] = []
    for (let i = 0; i < data.items.length; i++) {
      if (this.isValidFormat(data.items[i].type) !== false) {
        let blob = data.items[i].getAsFile()

        if (blob) {
          // We shouldn't fire the callback if we can't create `new Blob()`
          response.push(blob)
        }
      } else {
        this.props.onError('Неподдерживаемый формат изображения')
      }
    }
    cb(response)
  }

  checkPasted = (e: ClipboardEvent, cb: (images: File[]) => void) => {
    e.clipboardData && e.clipboardData.items.length > 0
      ? this.transformImages(e.clipboardData, cb)
      : this.props.onError('Сорямба, но это не картинка')
  }

  componentDidMount() {
    window.addEventListener('paste', this.pasteHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('paste', this.pasteHandler)
  }

  render() {
    return null
  }
}