import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon } from '@material-ui/core';
import Axios from 'axios';
import Form from '../components/Form'
import Types from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Funcs from '../util/Funcs';


const EmptyForm = (props: React.PropsWithChildren<{}>) => (
  <Card className='meme-form extra'>{props.children}</Card>
)

interface MarkState {
  state: 'loading' | 'ready' | 'error' | 'nojob'
  meme?: Types.Meme
}

class Markup extends React.Component<WithSnackbarProps, MarkState> {
  constructor(props: WithSnackbarProps) {
    super(props)
    this.state = {
      state: 'loading'
    }
  }

  setMeme(img: HTMLImageElement, id: number, imageDescription: string, textDescription: string) {
    this.setState({
      state: 'ready',
      meme: { img, id, imageDescription, textDescription }
    })
  }

  makeLoading() {
    this.setState({ state: 'loading', meme: undefined })
  }

  getNext() {
    const self = this
    Axios.get('api/unmarkedmemes/').then(function(response) {
      if (response.data.length === 0) {
        self.setState({ state: 'nojob' })
      } else {
        const json = response.data[0]
        Funcs.loadImage(json.id, json.url, image => {
          self.setMeme(image, json.id, json.imageDescription, json.textDescription)
        }, () => {
          self.setState({ state: 'error' })
        })
      }
    }).catch(function(error) {
      self.setState({ state: 'error' })
      const errorObj = Funcs.axiosError(error)
      if (!errorObj.resolved) {
        errorObj.msg = 'Неизвестная ошибка'
        errorObj.short = true
      }
      Funcs.showSnackbarAxiosError(self.props, errorObj)
    })
  }

  render() {
    const { state, meme } = this.state
    if (state === 'loading') {
      this.getNext()
    }
    if (state === 'nojob') {
      return (
        <Center>
          <BigFont>
            На данный момент на сайте нет неразмеченных мемов. Это очень хорошо.<br />
            Вы можете <Link to='/upload'>загрузить</Link> новые мемы
          </BigFont>
        </Center>
      )
    }
    if (state === 'error') {
      return (
        <Center>
          <div className='vmiddle'>
            <Typography>Не удалось загрузить мем.</Typography>
            <Button color='primary' onClick={() => this.setState({ state: 'loading' })}>Повторить попытку</Button>
          </div>
        </Center>
      )
    }
    return (
      <Center>
        {meme && this.state.state !== 'loading' ?
          <div>
            <Form meme={meme} signle={true} onDone={() => {
              this.makeLoading()
            }} />
            <Button
              className='refresh'
              onClick={() => this.setState({ state: 'loading' })}
              startIcon={<Icon>refresh</Icon>}
              color='primary'
            >Загрузить другой мем</Button>
          </div>
        :
          <EmptyForm><CircularProgress /></EmptyForm>
        }
      </Center>
    )
  }
}

export default withSnackbar(Markup)