import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography } from '@material-ui/core';
import Axios from 'axios';
import Form from '../components/Form'
import Types from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';


const EmptyForm = (props: React.PropsWithChildren<{}>) => (
  <Card className='meme-form extra'>{props.children}</Card>
)

interface MarkState {
  state: 'loading' | 'ready' | 'error' | 'nojob'
  meme?: Types.Meme
}

export default class Mark extends React.Component<{}, MarkState> {
  constructor(props: {}) {
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
        const img = new Image()
        img.onload = function() {
          self.setMeme(img, json.id, json.imageDescription, json.textDescription)
        }
        img.src = json.image.replace('http://localhost:8000', '')
      }
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
    return (
      <Center>
        {meme ?
          <Form meme={meme} signle={true} onDone={() => {
            this.makeLoading()
          }} />
        :
          <EmptyForm><CircularProgress /></EmptyForm>
        }
      </Center>
    )
  }
}