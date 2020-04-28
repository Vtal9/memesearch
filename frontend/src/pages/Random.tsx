import React from 'react'
import Center from '../layout/Center';
import { CircularProgress, Card, Typography, Button, Icon, CardMedia, CardActions } from '@material-ui/core';
import { CenterPadding } from '../components/DescriptionForm'
import { Meme, AuthState, User } from '../util/Types'
import { Link } from 'react-router-dom';
import BigFont from '../layout/BigFont';
import { withSnackbar, WithSnackbarProps } from 'notistack'
import { loadImage, authHeader } from '../util/Funcs';
import { randomApi } from '../api/RandomMeme';
import Axios from 'axios';



// TODO merge with gallery/AddRemove.tsx
type AddRemoveProps = WithSnackbarProps & {
  id: number
  own: boolean
  user: User
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


type State =
| { readonly type: 'loading' | 'error' | 'nojob' }
| { type: 'ready', id: number, img: HTMLImageElement, owners: User[] }

type Props = WithSnackbarProps & {
  authState: AuthState
}

class Random extends React.Component<Props, State> {
  state: State = { type: 'loading' }

  componentDidMount() {
    this.next()
  }

  setMeme(img: HTMLImageElement, id: number, owners: User[]) {
    this.setState({
      type: 'ready', img, id, owners
    })
  }

  async next() {
    this.setState({ type: 'loading' })
    try {
      const result = await randomApi()
      if (result === null) {
        this.setState({ type: 'error' })
      } else {
        loadImage(result.id, result.url, image => {
          this.setMeme(image, result.id, result.owner)
        }, () => {
          this.setState({ type: 'error' })
        })
      }
    } catch(error) {
      this.props.enqueueSnackbar('Нет интернета')
      this.setState({ type: 'error' })
    }
  }

  render() {
    if (this.state.type === 'nojob') {
      return (
        <Center>
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
        {this.state.type === 'ready' ?
          <div>
            <Card className='meme-form single'>
              <CardMedia component='img' className='img' image={this.state.img.src} />
              <CardActions>
                <Button
                  size='large'
                  onClick={() => this.next()}
                ><Icon>thumb_up_alt</Icon></Button>
                <Button
                  size='large'
                  onClick={() => this.next()}
                ><Icon>thumb_down_alt</Icon></Button>
                {this.props.authState.status === 'yes' ? (
                  <AddRemove
                    id={this.state.id}
                    own={this.state.owners.some(owner => 
                      this.props.authState.status === 'yes' &&
                      this.props.authState.user.id === owner.id
                    )}
                    user={this.props.authState.user}
                  />
                ) : (
                  <FakeAdd />
                )}
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