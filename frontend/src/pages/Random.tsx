import React from 'react'
import { PageProps } from './PageProps'
import GeneralizedMemeView from './GeneralizedMemeView'
import { randomApi } from '../api/MemesGetters'
import { CardActions } from '@material-ui/core'
import Voting from '../components/actions/Voting'
import MemeActions from '../components/actions/MemeActions'


export default (props: PageProps) => (
  <GeneralizedMemeView {...props}
    getRandom={() => randomApi([])}
    footer={p => (
      <CardActions className='meme-footer'>
        <Voting handle={() => p.self.nextLocation(true)} id={p.meme.id} />
        <MemeActions authState={props.authState} meme={p.meme} big />
      </CardActions>
    )}
  />
)