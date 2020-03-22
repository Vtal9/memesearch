import React from 'react'
import Axios from 'axios'
import { useDropzone } from 'react-dropzone';
import { Typography, ButtonBase, CircularProgress, Button, Card } from '@material-ui/core'
import Center from '../layout/Center'
import Form from '../components/Form'
import Icon from '@material-ui/core/Icon'

export interface FileGetterProps {
  handleFiles: Function
}

function FileGetter(props: FileGetterProps) {
  function handleFiles(files: Array<File>) {
    console.log(files)
    if (!files || files.length === 0) return
    props.handleFiles(files)
  }

  const { isDragActive, getRootProps, getInputProps} = useDropzone({
    onDrop: files => handleFiles(files)
  })

  return (
    <ButtonBase {...getRootProps()} style={{ width: '100%', marginBottom: 30 }}>
      <div className={isDragActive ? 'file-picker over' : 'file-picker'}>
        <input {...getInputProps()} accept="image/*" />
        <Icon fontSize='large'>cloud_upload</Icon>
        <Typography>Выберите файл с компьютера</Typography>
        <Typography variant='caption'>или</Typography>
        <Typography>Перетащите файлы сюда</Typography>
        {/* <Typography variant='caption'>или</Typography>
        <Typography>Вставьте картинку из буфера обмена</Typography>
        <Gluejar onPaste={() => {}} onError={() => {}} /> */}
      </div>
    </ButtonBase>
  )
}

const EmptyForm = (props: React.PropsWithChildren<{}>) => (
  <Card className='meme-form extra'>{props.children}</Card>
)

class UploadItem {
  private _file: File
  get file() {
    return this._file
  }

  private _id: number
  get id() {
    return this._id
  }

  private _img: HTMLImageElement
  get img() {
    return this._img
  }

  private _state: 'uploading' | 'uploaded' | 'done' | 'error' | 'none'
  get state() {
    return this._state
  }

  constructor(file: File) {
    this._file = file
    this._state = 'uploading'
  }

  setContent(id: number, img: HTMLImageElement) {
    this._state = 'uploaded'
    this._img = img
    this._id = id
  }

  setError() {
    this._state = 'error'
  }

  close() {
    this._state = 'none'
  }

  done() {
    this._state = 'done'
  }
}

interface UploadState {
  items: Array<UploadItem>
}

export default class Upload extends React.Component<{}, UploadState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      items: []
    }
  }

  handleFiles(files: Array<File>) {
    const initial_length = this.state.items.length
    const new_items = this.state.items.concat(...files.map(file => new UploadItem(file)))
    this.setState({ items: new_items })
    const self = this
    files.forEach((file, index) => {
      const formdata = new FormData()
      formdata.append('image', file)
      formdata.append("textDescription", "")
      formdata.append("imageDescription", "")
      Axios.post('api/memes/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function(response) {
        const img = new Image()
        img.onload = function() {
          new_items[initial_length + index].setContent(response.data.id, img)
          self.setState({ items: new_items })
        }
        img.src = response.data.image.replace('localhost:8000', 'localhost:3000')
      }).catch(function(error) {
        console.error(error)
        new_items[initial_length + index].setError()
        self.setState({ items: new_items })
      })
    })
  }

  close(index: number) {
    this.state.items[index].close()
    this.setState({ items: this.state.items })
  }

  render() {
    const { items } = this.state
    return (
      <Center>
        {items.map((item, index) =>
          item.state === 'uploaded' ? (
            <Form
              meme={{ id: item.id, img: item.img, imageDescription: '', textDescription: '' }} key={index}
              onDone={() => {
                items[index].done()
                this.setState({ items })
              }}
            />
          ) : item.state === 'uploading' ? (
            <EmptyForm key={index}>
              <CircularProgress />
            </EmptyForm>
          ) : item.state === 'error' ? (
            <EmptyForm key={index}>
              <div className='vmiddle'>
                <Typography color='error'>Загрузка {item.file.name} не удалась</Typography>
                <Button color='primary' onClick={() => this.close(index)}>Ладно</Button>
              </div>
            </EmptyForm>
          ) : item.state === 'done' ? (
            <EmptyForm key={index}>
              <div className='vmiddle'>
                <Typography>Спасибо за помощь!</Typography>
                <Button color='primary' onClick={() => this.close(index)}>ОК</Button>
              </div>
            </EmptyForm>
          ) : null
        )}
        <FileGetter handleFiles={(files: Array<File>) => this.handleFiles(files)} />
      </Center>
    )
  }
}