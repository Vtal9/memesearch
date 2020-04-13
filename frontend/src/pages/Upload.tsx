import React from 'react'
import Axios from 'axios'
import { useDropzone } from 'react-dropzone';
import { Typography, ButtonBase, CircularProgress, Button, Card, Select, MenuItem, FormControlLabel, Switch } from '@material-ui/core'
import Center from '../layout/Center'
import Form from '../components/DescriptionForm'
import Icon from '@material-ui/core/Icon'
import Funcs from '../util/Funcs';
import Gluejar from '../components/Gluejar'
import { Repo, AuthState } from '../util/Types';
import MySwitch from '../components/MySwitch';


function FileGetter(props: { handleFiles: (files: File[]) => void }) {
  function handleFiles(files: File[]) {
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

const EmptyForm: React.FC = (props) => (
  <Card className='meme-form extra'>{props.children}</Card>
)

class UploadItem {
  file: File
  status:
  | { readonly type: 'uploading' | 'done' | 'none' }
  | { type: 'uploaded', img: HTMLImageElement, id: number }
  | { type: 'error', text: string }

  constructor(file: File) {
    this.file = file
    this.status = { type: 'uploading' }
  }

  setError(text: string) {
    this.status = { type: 'error', text }
  }
}

type UploadState = {
  items: UploadItem[]
  desiredDestination: Repo
}

type UploadProps = {
  authState: AuthState
}

type UploadServerResponse = {
  id: number
  url: string
}

function upload(destination: Repo, file: File) {
  const formdata = new FormData()
  formdata.append('image', file)
  formdata.append("textDescription", "")
  formdata.append("imageDescription", "")

  const headers = destination === Repo.Own ? {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Token ${Funcs.getToken()}`
  } : {
    'Content-Type': 'multipart/form-data'
  }
  const url = destination === Repo.Own ? 'api/ownMemes/' : 'api/memes/'
  return new Promise<UploadServerResponse>((resolve, reject) => {
    Axios.post<UploadServerResponse>(url, formdata, {
      headers
    }).then(response => {
      resolve(response.data)
    }).catch(function(error) {
      if (error.response && error.response.data) {
        resolve(error.response.data)
      } else {
        reject()
      }
    })
  })
}

export default class Upload extends React.Component<UploadProps, UploadState> {
  state: UploadState = {
    items: [] as UploadItem[],
    desiredDestination: this.props.authState.status === 'yes' ? Repo.Own : Repo.Public
  }

  get destination(): Repo {
    return this.props.authState.status === 'yes' ? this.state.desiredDestination : Repo.Public
  }

  componentDidUpdate(prevProps: UploadProps) {
    if (prevProps.authState.status !== 'yes' && this.props.authState.status === 'yes') {
      this.setState({ desiredDestination: Repo.Own })
    }
  }

  withItem(index: number, map: (item: UploadItem) => UploadItem) {
    const items = this.state.items
    items[index] = map(items[index])
    this.setState({ items })
  }

  setError(index: number, text: string) {
    this.withItem(index, item => {
      item.setError(text)
      return item
    })
  }

  handleFiles(files: File[]) {
    const initial_length = this.state.items.length
    const new_items =  [ ...this.state.items, ...files.map(file => new UploadItem(file)) ]
    this.setState({ items: new_items })
    files.forEach((file, i) => {
      const current_index = initial_length + i
      if (file.size > 10 * 1024 * 1024) {
        this.setError(current_index, 'Превышен лимит в 10 МБ')
        return
      }
      upload(this.destination, file).then(response => {
        Funcs.loadImage(response.id, response.url, image => {
          this.withItem(current_index, item => {
            item.status = { type: 'uploaded', id: response.id, img: image }
            return item
          })
        }, () => {
          this.setError(current_index, 'Ошибка при отображении картинки')
        })
      }).catch(() => {
        this.setError(current_index, 'Нет интернета')
      })
    })
  }

  close(index: number) {
    this.withItem(index, item => {
      item.status = { type: 'none' }
      return item
    })
  }

  render() {
    const { items } = this.state
    return (
      <Center>
        {items.map((item, index) => {
          switch (item.status.type) {
          case 'uploaded':
            return (
              <Form key={index}
                meme={{
                  id: item.status.id,
                  img: item.status.img,
                  imageDescription: '',
                  textDescription: ''
                }}
                onDone={() => {
                  items[index].status = { type: 'done' }
                  this.setState({ items })
                }}
              />
            )
          case 'uploading':
            return (
              <EmptyForm key={index}>
                <CircularProgress />
              </EmptyForm>
            )
          case 'error':
            return (
              <EmptyForm key={index}>
                <div className='vmiddle'>
                  <Typography color='error'>
                    Загрузка {item.file.name} не удалась.<br />
                    {item.status.text}
                  </Typography>
                  <Button color='primary' onClick={() => this.close(index)}>Ладно</Button>
                </div>
              </EmptyForm>
            )
          case 'done':
            return (
              <EmptyForm key={index}>
                <div className='vmiddle'>
                  <Typography>Данные сохранены, спасибо за помощь!</Typography>
                  <Button color='primary' onClick={() => this.close(index)}>ОК</Button>
                </div>
              </EmptyForm>
            )
          }
        })}
        <FileGetter handleFiles={(files: Array<File>) => this.handleFiles(files)} />
        {this.props.authState.status === 'yes' &&
          <div>
            <div className='spacing' />
            <MySwitch
              value={this.state.desiredDestination === Repo.Own}
              onChange={checked => this.setState({
                desiredDestination: checked ? Repo.Own : Repo.Public
              })}
              label='Сразу добавить мемы в личное хранилище'
            />
          </div>
        }
        <div className='spacing' />
        <div className='spacing' />
      </Center>
    )
  }
}