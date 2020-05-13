import React from 'react'
import { Typography, IconButton } from '@material-ui/core'
import Axios from 'axios'
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';


type Props = {
  id: number
  handle?: () => {}
}

type State = {
  likes: number | undefined
  dislikes: number | undefined
  disabled: boolean
}

type Method = 'like' | 'dislike'

export default class Voting extends React.Component<Props, State> {
  state: State = { likes: undefined, dislikes: undefined, disabled: true }

  async vote(method: Method) {
    this.setState({ disabled: true })
    const data = (await Axios.post<State>(`api/like?method=${method}&id=${this.props.id}`)).data
    this.setState({ ...data, disabled: false })
  }

  async componentDidMount() {
    const data = (await Axios.get<State>(`api/memes/${this.props.id}/`)).data
    this.setState({ ...data, disabled: false })
  }

  render() {
    const handle = this.props.handle
    return (
      <div className='voting'>
        <IconButton
          onClick={() => {
            this.vote('like')
            handle && handle()
          }}
        ><ThumbUpOutlinedIcon /></IconButton>
        <Typography>
          {this.state.likes !== undefined && this.state.dislikes !== undefined ? (
            this.state.likes - this.state.dislikes
          ) : (
            '...'
          )}
        </Typography>
        <IconButton
          onClick={() => {
            this.vote('dislike')
            handle && handle()
          }}
        ><ThumbDownOutlinedIcon /></IconButton>
      </div>
    )
  }
}