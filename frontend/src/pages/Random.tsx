import React from 'react'
import { PageProps } from './PageProps'
import GeneralizedMemePage from './GeneralizedMemePage'
import { randomApi } from '../api/MemesLists'
import { CardActions } from '@material-ui/core'
import Voting from '../components/Voting'
import MemeActions from '../components/gallery/MemeActions'


export default (props: PageProps) => (
  <GeneralizedMemePage {...props}
    getRandom={() => randomApi([])}
    footer={p => (
      <CardActions className='meme-footer'>
        <Voting handle={() => p.self.nextLocation(true)} id={p.meme.id} />
        <MemeActions authState={props.authState} meme={p.meme} big />
      </CardActions>
    )}
  />
)