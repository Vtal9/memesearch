import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardContent, CardActions } from '@material-ui/core';
import Axios from 'axios';
import Form, { CenterPadding } from '../components/DescriptionForm'
import { Meme } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Funcs from '../util/Funcs';


interface RandomState {
  status:
  | { readonly type: 'loading' | 'error' | 'nojob' }
  | { type: 'ready', meme: Meme }
}

class Random extends React.Component<WithSnackbarProps, RandomState> {
  state: RandomState = {
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

  next() {
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
              this.next()
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
              <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  onClick={() => this.next()}
                ><Icon color='primary'>thumb_up_alt</Icon></Button>
                <Button
                  size='large'
                  onClick={() => this.next()}
                ><Icon>thumb_down_alt</Icon></Button>
              </CardActions>
            </Card>
          </div>
        :
          <CenterPadding><CircularProgress /></CenterPadding>
        }
      </Center>
    )
  }
}

export default withSnackbar(Random)