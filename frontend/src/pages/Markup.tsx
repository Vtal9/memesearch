import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardContent } from '@material-ui/core';
import Axios from 'axios';
import Form, { CenterPadding } from '../components/DescriptionForm'
import { Meme } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Funcs from '../util/Funcs';


interface MarkState {
  status:
  | { readonly type: 'loading' | 'error' | 'nojob' }
  | { type: 'ready', meme: Meme }
}

class Markup extends React.Component<WithSnackbarProps, MarkState> {
  state: MarkState = {
    status: { type: 'loading' }
  }

  setMeme(img: HTMLImageElement, id: number, imageDescription: string, textDescription: string) {
    this.setState({
      status: {
        type: 'ready',
        meme: { img, id, imageDescription, textDescription }
      }
    })
  }

  makeLoading() {
    this.setState({ status: { type: 'loading' } })
  }

  getNext() {
    const self = this
    Axios.get('api/unmarkedmemes/').then(function(response) {
      if (response.data.length === 0) {
        self.setState({ status: { type: 'nojob' } })
      } else {
        const json = response.data[0]
        Funcs.loadImage(json.id, json.url, image => {
          self.setMeme(image, json.id, json.imageDescription, json.textDescription)
        }, () => {
          self.setState({ status: { type: 'error' } })
        })
      }
    }).catch(function(error) {
      Funcs.showSnackbarError(self.props, { msg: 'Неизвестная ошибка', short: true })
    })
  }

  render() {
    const { status } = this.state
    if (status.type === 'loading') {
      this.getNext()
    }
    if (status.type === 'nojob') {
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
                <Form memeId={status.meme.id}
                  initialImageDescription={status.meme.imageDescription}
                  initialTextDescription={status.meme.textDescription}
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