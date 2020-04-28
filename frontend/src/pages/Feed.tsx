import React from 'react'
import Gallery from '../components/Gallery'
import { UnloadedMeme, AuthState } from '../util/Types'
import { CircularProgress } from '@material-ui/core'
import Center from '../layout/Center'
import BigFont from '../layout/BigFont'
import { memesFeedApi } from '../api/MemesFeed'


type MyMemesProps = {
  authState: AuthState
}

type FeedState = {
  status:
  | { type: 'loading' }
  | { type: 'done', list: UnloadedMeme[] }
}

// TODO: make this beatiful: remove excess buttons, add likes and dislikes number etc
export default class Feed extends React.Component<MyMemesProps, FeedState> {
  constructor(props: MyMemesProps) {
    super(props)
    this.state = {
      status: { type: 'loading' }
    }
    this.load()
  }

  async load() {
    this.setState({ status: { type: 'loading' } })
    this.setState({
      status: { type: 'done', list: (await memesFeedApi("ratio", [1, 2], 1)).map( // dummy request
        // FeedMeme (with likes dislikes) -> UnloadedMeme (since Gallery is written for these)
        (meme) => ({
          type: 'native',
          id: meme.id, 
          url: meme.url
        })
      ) }
    })
  }

  render() {
    return (
      <Center>
        {this.state.status.type === 'done' ?
          <div>
            {this.state.status.list.length === 0 ?
              <BigFont>Мемы кончились... :c</BigFont>
            :
              <BigFont>Свежие мемы</BigFont>
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