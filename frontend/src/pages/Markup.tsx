import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardContent } from '@material-ui/core';
import Form, { CenterPadding } from '../components/meme/DescriptionForm'
import { FullMeme } from '../util/Types'
import { Link, withRouter } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { makeVisible } from '../util/Funcs';
import { unmarkedApi } from '../api/MemesLists';
import { PageProps } from './PageProps';


type Props = PageProps & WithSnackbarProps

type State =
| { readonly type: 'loading' | 'error' | 'cool' }
| { type: 'ready', meme: FullMeme }

class Markup extends React.Component<Props, State> {
  state: State = { type: 'loading' }

  makeLoading() {
    this.setState({ type: 'loading' })
  }

  async getNext() {
    try {
      const result = await unmarkedApi()
      if (result === null) {
        this.setState({ type: 'cool' })
      } else {
        try {
          this.setState({ type: 'ready', meme: await makeVisible(result) })
        } catch {
          this.setState({ type: 'error' })
        }
      }
    } catch(error) {
      this.props.enqueueSnackbar('Нет интернета')
    }
  }

  render() {
    if (this.state.type === 'loading') {
      this.getNext()
    }
    if (this.state.type === 'cool') {
      return (
        <Center>
          <div className='spacing'></div>
          <BigFont>
            На данный момент на сайте нет неразмеченных мемов. Это очень хорошо.<br />
            Вы можете <Link to='/upload'>загрузить</Link> новые мемы
          </BigFont>
        </Center>
      )
    }
    if (this.state.type === 'error') {
      return (
        <Center>
          <div className='spacing'></div>
          <div className='vmiddle'>
            <Typography>Не удалось загрузить мем.</Typography>
            <Button color='primary' onClick={() => {
              this.setState({ type: 'loading' })
            }}>Повторить попытку</Button>
          </div>
        </Center>
      )
    }
    return (
      <Center>
        <div className='spacing'></div>
        {this.state.type === 'ready' ?
          <div>
            <Card className='meme-form single'>
              <CardMedia component='img' className='img' image={this.state.meme.img.src} />
              <CardContent className='content'>
                <Form memeId={this.state.meme.id} autofocus
                  onDone={() => {
                    this.makeLoading()
                  }}
                />
              </CardContent>
            </Card>
            <Button
              className='refresh'
              onClick={() => this.setState({ type: 'loading' })}
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

export default withRouter(withSnackbar(Markup))