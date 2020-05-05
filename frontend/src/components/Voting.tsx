import React from 'react'
import { Button, Icon } from '@material-ui/core'
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
      <Button
        key={1}
        size='large'
        onClick={() => {
          this.vote('like')
          handle && handle()
        }}
        startIcon={<Icon>thumb_up_alt</Icon>}
      >{this.state.likes === 0 ? '' : this.state.likes}</Button>,
      <Button
        key={2}
        size='large'
        onClick={() => {
          this.vote('dislike')
          handle && handle()
        }}
        startIcon={<Icon>thumb_down_alt</Icon>}
      >{this.state.dislikes === 0 ? '' : this.state.dislikes}</Button>,
    ]
  }
}