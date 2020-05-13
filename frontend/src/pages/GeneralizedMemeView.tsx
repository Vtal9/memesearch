import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, CardMedia } from '@material-ui/core';
import { CenterPadding } from '../components/forms/Description'
import { FullMeme, Tag, InvisibleMeme } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { makeVisible } from '../util/Funcs';
import { getMeme } from '../api/MemesGetters';
import { PageProps } from './PageProps';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'


type State = (
  | { status: 'loading' | 'error' | 'nojob' }
  | { readonly status: 'ready', meme: FullMeme }
) & {
  bannedTags: Tag[]
}

type Props = {
  getRandom: () => Promise<InvisibleMeme>
  footer: React.FC<{ meme: FullMeme, self: GeneralizedMemePage }>
  nextButton?: boolean
} & PageProps

export default class GeneralizedMemePage extends React.Component<Props, State> {
  state: State = {
    status: 'loading', bannedTags: []
  }

  getId(props: Props) {
    console.log(props)
    const params = props.match.params as any
    if (params.id != '.') {
      return parseInt(params.id)
    }
  }

  async componentDidMount() {
    const id = this.getId(this.props)
    if (id === undefined) {
      this.nextLocation(false)
    } else {
      this.loadSpecific(id)
    }
  }

  async componentDidUpdate(prevProps: Props) {
    const curId = this.getId(this.props)
    if (curId !== undefined && this.state.status === 'ready' && this.state.meme.id != curId && this.getId(prevProps) != curId) {
      console.log('want to load specific')
      console.log(this.state.meme)
      console.log(curId)
      this.loadSpecific(curId)
    }
  }

  async loadSpecific(id: number) {
    this.setState({ status: 'loading' })
    try {
      const invisible = await getMeme(id)
      try {
        const result = await makeVisible(invisible)
        this.setState({ status: 'ready', meme: result, bannedTags: this.state.bannedTags })
      } catch {
        this.setState({ status: 'error' })
      }
    } catch {
      this.props.enqueueSnackbar('Нет интернета')
      this.setState({ status: 'error' })
    }
  }

  async nextLocation(push: boolean) {
    const id = await this.next()
    if (id !== undefined) {
      if (push) {
        this.props.history.push(`${id}`)
      } else {
        this.props.history.replace(`${id}`)
      }
    }
  }

  async next() {
    this.setState({ status: 'loading' })
    try {
      const result = await this.props.getRandom()
      console.log(result)
      if (result === null) {
        this.setState({ status: 'error' })
      } else {
        try {
          this.setState({ status: 'ready', meme: await makeVisible(result), bannedTags: this.state.bannedTags })
          return result.id
        } catch {
          this.setState({ status: 'error' })
        }
      }
    } catch(error) {
      this.props.enqueueSnackbar('Нет интернета')
      this.setState({ status: 'error' })
    }
  }

  render() {
    console.log('must rerender')
    if (this.state.status === 'nojob') {
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
    if (this.state.status === 'error') {
      return (
        <Center>
          <div className='spacing'></div>
          <div className='vmiddle'>
            <Typography>Не удалось загрузить мем.</Typography>
            <Button color='primary' onClick={() => {
              this.nextLocation(true)
            }}>Повторить попытку</Button>
          </div>
        </Center>
      )
    }
    return (
      <Center>
        <div className='spacing'></div>
        {this.state.status === 'ready' ? (
          <div>
            <Button
              color='primary'
              variant='outlined'
              onClick={() => this.props.history.goBack()}
              startIcon={<ArrowBackIcon />}
            >Назад</Button>
            <div className='spacing'></div>
            <Card className='meme-form single'>
              <CardMedia component='img' className='img' image={this.state.meme.img.src} />
              <this.props.footer meme={this.state.meme} self={this} />
            </Card>
            {this.props.nextButton &&
              <Button
                className='refresh'
                onClick={() => this.nextLocation(true)}
                endIcon={<NavigateNextIcon />}
                color='primary'
              >Следующий мем</Button>
            }
          </div>
        ) : (
          <CenterPadding><CircularProgress /></CenterPadding>
        )}
      </Center>
    )
  }
}