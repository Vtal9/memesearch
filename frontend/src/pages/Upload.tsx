import React from 'react'
import Axios from 'axios'
import { useDropzone } from 'react-dropzone';
import { Typography, ButtonBase, CircularProgress, Button, Card, Select, MenuItem } from '@material-ui/core'
import Center from '../layout/Center'
import Form from '../components/Form'
import Icon from '@material-ui/core/Icon'
import Funcs from '../util/Funcs';
import Gluejar from '../components/Gluejar'
import { Store } from 'redux';
import Types from '../util/Types';


export interface FileGetterProps {
  handleFiles: Function
}

function FileGetter(props: FileGetterProps) {
  function handleFiles(files: Array<File>) {
    if (!files || files.length === 0) return
    props.handleFiles(files)
  }

  const { isDragActive, getRootProps, getInputProps} = useDropzone({
    onDrop: files => handleFiles(files),
    accept: 'image/*'
  })

  return (
    <ButtonBase {...getRootProps()} style={{ width: '100%' }}>
      <div className={isDragActive ? 'file-picker over' : 'file-picker'}>
        <input {...getInputProps()} />
        <Icon fontSize='large'>cloud_upload</Icon>
        <Typography>Выберите файл с компьютера</Typography>
        <Typography variant='caption'>или</Typography>
        <Typography>Перетащите файлы сюда</Typography>
        <Typography variant='caption'>или</Typography>
        <Typography>Вставьте картинку из буфера обмена</Typography>
        <Gluejar onPaste={files => handleFiles(files)} onError={() => {}} />
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

  private _error_text: string
  get error_text() {
    return this._error_text
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

  setError(text: string) {
    this._state = 'error'
    this._error_text = text
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
  authState: Types.AuthState
  toOwnRepo: 1 | 0
}

interface UploadProps {
  authStore: Store<Types.AuthState>
}

export default class Upload extends React.Component<UploadProps, UploadState> {
  constructor(props: UploadProps) {
    super(props)
    this.state = {
      items: [],
      authState: props.authStore.getState(),
      toOwnRepo: 0
    }
    props.authStore.subscribe(() => this.setState({ authState: props.authStore.getState() }))
  }

  componentDidUpdate(_: any, prevState: UploadState) {
    if (prevState.authState.status === "yes" && this.state.authState.status !== "yes") {
      this.setState({ toOwnRepo: 0 })
    }
  }

  handleFiles(files: Array<File>) {
    const initial_length = this.state.items.length
    const new_items = this.state.items.concat(...files.map(file => new UploadItem(file)))
    this.setState({ items: new_items })
    const self = this
    files.forEach((file, index) => {
      const formdata = new FormData()
      if (file.size > 10 * 1024 * 1024) {
        new_items[initial_length + index].setError('Превышен лимит в 10 МБ')
        self.setState({ items: new_items })
        return
      }
      formdata.append('image', file)
      formdata.append("textDescription", "")
      formdata.append("imageDescription", "")

      const headers = this.state.toOwnRepo ? {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${Funcs.getToken()}`
      } : {
        'Content-Type': 'multipart/form-data'
      }
      //const url = this.state.toOwnRepo ? 'api/memes/' : 'api/memes/own/'
      const url = 'api/memes/'
      Axios.post(url, formdata, {
        headers
      }).then(function(response) {
        Funcs.loadImage(response.data.id, response.data.url, image => {
          new_items[initial_length + index].setContent(response.data.id, image)
          self.setState({ items: new_items })
        }, () => {
          new_items[initial_length + index].setError('Ошибка при загрузке')
          self.setState({ items: new_items })
        })
      }).catch(function(error) {
        const errorObj = Funcs.axiosError(error)
        if (!errorObj.resolved) {
          if (error.response && error.response.status === 400) {
            errorObj.msg = 'Файл должен быть картинкой'
          } else {
            errorObj.msg = 'Неизвестная ошибка'
          }
        }
        new_items[initial_length + index].setError(errorObj.msg)
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
    console.log(this.state.authState.status)
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
                <Typography color='error'>
                  Загрузка {item.file.name} не удалась.<br />
                  {item.error_text}
                </Typography>
                <Button color='primary' onClick={() => this.close(index)}>Ладно</Button>
              </div>
            </EmptyForm>
          ) : item.state === 'done' ? (
            <EmptyForm key={index}>
              <div className='vmiddle'>
                <Typography>Данные сохранены, спасибо за помощь!</Typography>
                <Button color='primary' onClick={() => this.close(index)}>ОК</Button>
              </div>
            </EmptyForm>
          ) : null
        )}
        <FileGetter handleFiles={(files: Array<File>) => this.handleFiles(files)} />
        {this.state.authState.status === 'yes' &&
          <div>
            <div className='spacing' />
            <Typography>Мемы буду загружаться</Typography>
            <Select
              value={this.state.toOwnRepo}
              onChange={e => this.setState({ toOwnRepo: e.target.value as 0 | 1 })}
            >
              <MenuItem value={0}>в общее хранилище</MenuItem>
              <MenuItem value={1}>в личное хранилище</MenuItem>
            </Select>
          </div>
        }
        <div className='spacing' />
        <div className='spacing' />
      </Center>
    )
  }
}