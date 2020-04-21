import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardActions } from '@material-ui/core';
import { CenterPadding } from '../components/DescriptionForm'
import { Meme } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack'
import { loadImage } from '../util/Funcs';
import { randomApi } from '../api/RandomMeme';


type State = {
  status:
  | { readonly type: 'loading' | 'error' | 'nojob' }
  | { type: 'ready', meme: Meme }
}

type Props = WithSnackbarProps

class Random extends React.Component<Props, State> {
  state: State = {
    status: { type: 'loading' }
  }

  componentDidMount() {
    this.next()
  }

  setMeme(img: HTMLImageElement, id: number) {
    this.setState({
      status: {
        type: 'ready',
        meme: { img, id, imageDescription: '', textDescription: '' }
      }
    })
  }

  async next() {
    this.setState({ status: { type: 'loading' } })
    try {
      const result = await randomApi()
      if (result === null) {
        this.setState({ status: { type: 'error' } })
      } else {
        loadImage(result.id, result.url, image => {
          this.setMeme(image, result.id)
        }, () => {
          this.setState({ status: { type: 'error' } })
        })
      }
    } catch(error) {
      this.props.enqueueSnackbar('Нет интернета')
      this.setState({ status: { type: 'error' } })
    }
  }

  render() {
    const { status } = this.state
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