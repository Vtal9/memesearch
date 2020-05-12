import React from 'react'
import { Button, Icon, Typography, IconButton } from '@material-ui/core'
import Axios from 'axios'


type Props = {
  id: number
  handle?: () => {}
}

type State = {
  likes: number
  dislikes: number
}

type Method = 'like' | 'dislike'

export default class Voting extends React.Component<Props, State> {
  state: State = { likes: 0, dislikes: 0 }

  async vote(method: Method) {
    this.setState((await Axios.post<State>(`api/like?method=${method}&id=${this.props.id}`)).data)
  }

  async componentDidMount() {
    this.setState((await Axios.get<State>(`api/memes/${this.props.id}/`)).data)
  }

  render() {
    const handle = this.props.handle
    return [
      <IconButton
        key={1}
        onClick={() => {
          this.vote('like')
          handle && handle()
        }}
      ><Icon>thumb_up_alt</Icon></IconButton>,
      <Typography key={3}>{this.state.likes - this.state.dislikes}</Typography>,
      <IconButton
        key={2}
        onClick={() => {
          this.vote('dislike')
          handle && handle()
        }}
      ><Icon>thumb_down_alt</Icon></IconButton>,
    ]
  }
}