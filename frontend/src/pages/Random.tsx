import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardActions } from '@material-ui/core';
import { CenterPadding } from '../components/meme/DescriptionForm'
import { AuthState, FullMeme, Tag } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack'
import { authHeader, pureToFull } from '../util/Funcs';
import { randomApi } from '../api/MemesLists';
import Axios from 'axios';
import Voting from '../components/Voting';
import TagsPicker from '../components/TagsPicker';



// TODO merge with gallery/AddRemove.tsx
type AddRemoveProps = WithSnackbarProps & {
  id: number
  own: boolean
}

type AddRemoveState = {
  own: boolean
  disabled: boolean
}

class _AddRemove extends React.Component<AddRemoveProps, AddRemoveState> {
  state: AddRemoveState = {
    own: this.props.own,
    disabled: false
  }

  addDelete(method: 'add' | 'remove') {
    this.setState({ disabled: true })
    Axios.post(
      `api/configureOwnMemes?method=${method}&id=${this.props.id}`, {}, 
      {
        headers: authHeader()
      }
    ).then(response => {
      this.setState({ disabled: false, own: !this.state.own })
      this.props.enqueueSnackbar(
        method === 'remove' ? 'Мем удалён из вашей коллекции' : 'Мем добавлен в вашу коллекцию'
      )
    }).catch(error => {
      this.setState({ disabled: false })
    })
  }

  render() {
    return (
      <Button
        style={{ marginLeft: 'auto' }}
        size='large'
        disabled={this.state.disabled}
        onClick={() => {
          this.addDelete(this.state.own ? 'remove' : 'add')
        }}
        title={this.state.own ? 'Удалить из своей коллекции' : 'Добавить в свою коллекцию'}
      ><Icon>{this.state.own ? 'delete' : 'add'}</Icon></Button>
    )
  }
}

const AddRemove = withSnackbar(_AddRemove)

const FakeAdd = withSnackbar((props: WithSnackbarProps) => (
  <Button
    style={{ marginLeft: 'auto' }}
    size='large'
    title='Добавить в свою коллекцию'
    onClick={() => props.enqueueSnackbar('Авторизуйтесь, и вы сможете сохранять мемы в свою коллекцию')}
  ><Icon>add</Icon></Button>
))


type State = {
  state:
  | { readonly status: 'loading' | 'error' | 'nojob' }
  | { status: 'ready', meme: FullMeme }
  bannedTags: Tag[]
}

type Props = WithSnackbarProps & {
  authState: AuthState
}

class Random extends React.Component<Props, State> {
  state: State = { state: { status: 'loading' }, bannedTags: [] }

  componentDidMount() {
    this.next()
  }

  async next() {
    this.setState({ state: { status: 'loading' } })
    try {
      const result = await randomApi(this.state.bannedTags)
      console.log(result)
      if (result === null) {
        this.setState({ state: { status: 'error' } })
      } else {
        try {
          this.setState({ state: { status: 'ready', meme: await pureToFull(result) } })
        } catch {
          this.setState({ state: { status: 'error' } })
        }
      }
    } catch(error) {
      this.props.enqueueSnackbar('Нет интернета')
      this.setState({ state: { status: 'error' } })
    }
  }

  render() {
    if (this.state.state.status === 'nojob') {
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
    if (this.state.state.status === 'error') {
      return (
        <Center>
          <div className='spacing'></div>
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
        {/* <div className='spacing'></div>
        <TagsPicker
          tags={this.state.bannedTags}
          onChange={tags => this.setState({ bannedTags: tags })}
        >
          <Icon fontSize='small'>remove</Icon>Тег
        </TagsPicker> */}
        <div className='spacing'></div>
        {this.state.state.status === 'ready' ? (
          <div>
            <Card className='meme-form single'>
              <CardMedia component='img' className='img' image={this.state.state.meme.img.src} />
              <CardActions>
                <Voting handle={() => this.next()} id={this.state.state.meme.id} />
                {this.props.authState.status === 'yes' ? (
                  <AddRemove
                    id={this.state.state.meme.id}
                    own={this.state.state.meme.owner.some(owner => 
                      this.props.authState.status === 'yes' &&
                      this.props.authState.user.id === owner.id
                    )}
                  />
                ) : (
                  <FakeAdd />
                )}
              </CardActions>
            </Card>
          </div>
        ) : (
          <CenterPadding><CircularProgress /></CenterPadding>
        )}
      </Center>
    )
  }
}

export default withSnackbar(Random)