import React from 'react'
import Gallery from '../components/Gallery'
import { UnloadedMeme, AuthState } from '../util/Types'
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { CircularProgress } from '@material-ui/core'
import Center from '../layout/Center'
import BigFont from '../layout/BigFont'


type MyMemesProps = {
  authState: AuthState
}

type MyMemesState = {
  status:
  | { type: 'loading' }
  | { type: 'done', list: UnloadedMeme[] }
}

export default class MyMemes extends React.Component<MyMemesProps, MyMemesState> {
  constructor(props: MyMemesProps) {
    super(props)
    this.state = {
      status: { type: 'loading' }
    }
    Axios.get<UnloadedMeme[]>('api/ownMemes/', {
      headers: {
        Authorization: `Token ${Funcs.getToken()}`
      }
    }).then(response => {
      this.setState({
        status: { type: 'done', list: response.data }
      })
    })
  }

  render() {
    return (
      <Center>
        {this.state.status.type === 'done' ?
          <div>
            {this.state.status.list.length === 0 ?
              <BigFont>Вы пока не сохранили ни одного мема</BigFont>
            :
              <BigFont>Мемы мои мемы</BigFont>
            }
            <Gallery list={this.state.status.list} authState={this.props.authState} />
          </div>
        :
          <CircularProgress />
        }   
      </Center>
    )
  }
}