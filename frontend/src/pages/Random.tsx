import React from 'react'
import { PageProps } from './PageProps'
import GeneralizedMemeView from './GeneralizedMemeView'
import { randomApi } from '../api/MemesGetters'
import { CardActions } from '@material-ui/core'
import Voting from '../components/actions/Voting'
import MemeActions from '../components/actions/MemeActions'
import { Tag } from '../util/Types'
import TagsPicker from '../components/inputs/TagsPicker'


type State = {
  tags: Tag[]
}

export default class Random extends React.Component<PageProps, State> {
  state: State = { tags: [] }

  render() {
    return (
      <GeneralizedMemeView {...this.props}
        getRandom={() => randomApi(this.state.tags)}
        filters={
          <TagsPicker
            tags={this.state.tags}
            onChange={tags => this.setState({ tags })}
          >Исключить теги...</TagsPicker>
        }
        footer={p => (
          <CardActions className='meme-footer'>
            <Voting handle={() => p.self.nextLocation(true)} id={p.meme.id} />
            <MemeActions authState={this.props.authState} meme={p.meme} big />
          </CardActions>
        )}
      />
    )
  }
}