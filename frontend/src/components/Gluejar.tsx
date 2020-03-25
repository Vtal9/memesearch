/**
 * Slightly modified React Gluejar library
 * https://github.com/charliewilco/react-gluejar
 * We do not own anything
 */


import React from 'react'

export interface GluejarState {
  images: string[]
}

export interface GluejarProps {
  children?: (state: GluejarState) => React.ReactNode
  container: HTMLElement
  onPaste: (state: GluejarState) => void
  onError: (error: string) => void
  acceptedFiles: string[]
}

type BlobLikeFile = File | null

export default class Gluejar extends React.Component<GluejarProps, GluejarState> {
  static displayName = 'Gluejar'

  static defaultProps = {
    onPaste: () => null,
    errorHandler: () => null,
    acceptedFiles: ['image/gif', 'image/png', 'image/jpeg', 'image/bmp']
  }

  state = {
    images: []
  }

  getContainer = (): HTMLElement => this.props.container || window

  isValidFormat = (fileType: string): boolean => this.props.acceptedFiles.indexOf(fileType) !== -1

  pasteHandler = (e: ClipboardEvent) => this.checkPasted(e, this.pushImage)

  transformImages = (data: DataTransfer, cb: Function) => {
    // NOTE: This needs to be a for loop, it's a list like object
    for (let i = 0; i < data.items.length; i++) {
      if (this.isValidFormat(data.items[i].type) !== false) {
        let blob = data.items[i].getAsFile()

        if (blob) {
          // We shouldn't fire the callback if we can't create `new Blob()`
          cb(blob)
        }
      } else {
        this.props.onError('Неподдерживаемый формат изображения')
      }
    }
  }

  checkPasted = (e: ClipboardEvent, cb: Function) => {
    e.clipboardData && e.clipboardData.items.length > 0
      ? this.transformImages(e.clipboardData, cb)
      : this.props.onError('Сорямба, но это не картинка')
  }

  pushImage = (source: string) =>
    this.setState(({ images }: GluejarState) => ({ images: [...images, source] }))

  componentDidMount() {
    const elm: Element = this.getContainer()
    elm.addEventListener('paste', this.pasteHandler)
  }

  componentDidUpdate() {
    this.props.onPaste(this.state)
  }

  componentWillUnmount() {
    const elm: HTMLElement = this.getContainer()
    elm.removeEventListener('paste', this.pasteHandler)
  }

  render() {
    const { images } = this.state
    const { children } = this.props
    return children ? children({ images }) : null
  }
}