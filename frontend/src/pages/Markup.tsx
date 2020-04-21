import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardContent } from '@material-ui/core';
import Form, { CenterPadding } from '../components/DescriptionForm'
import { Meme } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { loadImage } from '../util/Funcs';
import { unmarkedApi } from '../api/RandomMeme';


interface MarkState {
  status:
  | { readonly type: 'loading' | 'error' | 'cool' }
  | { type: 'ready', meme: Meme }
}

class Markup extends React.Component<WithSnackbarProps, MarkState> {
  state: MarkState = {
    status: { type: 'loading' }
  }

  setMeme(img: HTMLImageElement, id: number) {
    this.setState({
      status: {
        type: 'ready',
        meme: { img, id, imageDescription: '', textDescription: '' }
      }
    })
  }

  makeLoading() {
    this.setState({ status: { type: 'loading' } })
  }

  async getNext() {
    try {
      const result = await unmarkedApi()
      if (result === null) {
        this.setState({ status: { type: 'cool' } })
      } else {
        loadImage(result.id, result.url, image => {
          this.setMeme(image, result.id)
        }, () => {
          this.setState({ status: { type: 'error' } })
        })
      }
    } catch(error) {
      this.props.enqueueSnackbar('Нет интернета')
    }
  }

  render() {
    const { status } = this.state
    if (status.type === 'loading') {
      this.getNext()
    }
    if (status.type === 'cool') {
      return (
        <Center>
          <BigFont>
            На данный момент на сайте нет неразмеченных мемов. Это очень хорошо.<br />
            Вы можете <Link to='/upload'>загрузить</Link> новые мемы
          </BigFont>
        </Center>
      )
    }
    if (status.type === 'error') {
      return (
        <Center>
          <div className='vmiddle'>
            <Typography>Не удалось загрузить мем.</Typography>
            <Button color='primary' onClick={() => {
              this.setState({ status: { type: 'loading' } })
            }}>Повторить попытку</Button>
          </div>
        </Center>
      )
    }
    return (
      <Center>
        {status.type === 'ready' ?
          <div>
            <Card className='meme-form single'>
              <CardMedia component='img' className='img' image={status.meme.img.src} />
              <CardContent className='content'>
                <Form memeId={status.meme.id} autofocus
                  onDone={() => {
                    this.makeLoading()
                  }}
                />
              </CardContent>
            </Card>
            <Button
              className='refresh'
              onClick={() => this.setState({ status: { type: 'loading' } })}
              endIcon={<Icon>navigate_next</Icon>}
              color='primary'
            >Следующий мем</Button>
          </div>
        :
          <CenterPadding><CircularProgress /></CenterPadding>
        }
      </Center>
    )
  }
}

export default withSnackbar(Markup)