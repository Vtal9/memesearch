import React from 'react'
import { Typography, CircularProgress, Button, Card, CardMedia, CardContent } from '@material-ui/core'
import Center from '../layout/Center'
import Form, { CenterPadding } from '../components/DescriptionForm'
import { Repo, AuthState } from '../util/Types';
import MySwitch from '../components/MySwitch';
import { loadImage } from '../util/Funcs';
import FilePicker from '../components/FilePicker'
import { uploadApi } from '../api/Upload';


class UploadItem {
  file: File
  status:
  | { readonly type: 'rendering' | 'done' | 'none' }
  | { type: 'uploading', img: HTMLImageElement }
  | { type: 'uploaded', img: HTMLImageElement, id: number }
  | { type: 'error', text: string }

  constructor(file: File) {
    this.file = file
    this.status = { type: 'rendering' }
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
    files.forEach(async (file, i) => {
      const current_index = initial_length + i
      if (file.size > 10 * 1024 * 1024) {
        this.setError(current_index, 'Превышен лимит в 10 МБ')
        return
      }
      // rendering
      try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = reject
          image.src = URL.createObjectURL(file)
        })
        this.withItem(current_index, item => {
          item.status = { type: 'uploading', img: image }
          return item
        })
      } catch {
        this.setError(current_index, 'Ошибка при отображении картинки')
      }
      // uploading
      const result = await uploadApi(this.destination, file)
      try {
        if (result !== null) {
          loadImage(result.id, result.url, image => {
            this.withItem(current_index, item => {
              item.status = { type: 'uploaded', id: result.id, img: image }
              return item
            })
          }, () => {
            this.setError(current_index, 'Ошибка при отображении картинки')
          })
        } else {
          this.setError(current_index, 'Ошибка сервера')
        }
      } catch {
        this.setError(current_index, 'Нет интернета')
      }
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
        {items.map((item, index) => (
          <Card className='meme-form' key={index} style={{
            display: item.status.type === 'none' ? 'none' : ''
          }}>
            {item.status.type === 'done' ? (
              <CenterPadding>
                <div className='vmiddle'>
                  <Typography>Данные сохранены, спасибо за помощь!</Typography>
                  <Button color='primary' onClick={() => this.close(index)}>ОК</Button>
                </div>
              </CenterPadding>
            ) : item.status.type === 'error' ? (
              <CenterPadding>
                <div className='vmiddle'>
                  <Typography color='error'>
                    Загрузка {item.file.name} не удалась.<br />
                    {item.status.text}
                  </Typography>
                  <Button color='primary' onClick={() => this.close(index)}>Ладно</Button>
                </div>
              </CenterPadding>
            ) : item.status.type === 'rendering' ? (
              <CenterPadding>
                <CircularProgress />
              </CenterPadding>
            ) : item.status.type === 'uploading' || item.status.type === 'uploaded' ? (
              [
                <CardMedia
                  key={1}
                  component='img'
                  className='img'
                  image={item.status.img.src}
                />,
                <CardContent className='content' key={2}>
                  <Form key={index}
                    memeId={item.status.type === 'uploaded' && item.status.id}
                    onDone={() => {
                      items[index].status = { type: 'done' }
                      this.setState({ items })
                    }}
                  />
                  {item.status.type === 'uploading' &&
                    <div className='vmiddle' style={{
                      marginTop: 16,
                      justifyContent: 'flex-end'
                    }}>
                      <Typography style={{ marginRight: 16 }} align='right'>
                        Можно будет сохранить описание,<br />когда картинка загрузится на сервер
                      </Typography>
                      <CircularProgress />
                    </div>
                  }
                </CardContent>
              ]
            ) : null}
          </Card>
        ))}
        <FilePicker handleFiles={(files: Array<File>) => this.handleFiles(files)} />
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