import React from 'react'
import { PageProps } from './PageProps'
import GeneralizedMemeView from './GeneralizedMemeView'
import { unmarkedApi } from '../api/MemesGetters'
import { CardContent } from '@material-ui/core'
import Form from '../components/forms/Description'
import { PureMeme } from '../util/Types'


export default (props: PageProps) => (
  <GeneralizedMemeView {...props}
    getRandom={() => unmarkedApi() as Promise<PureMeme>}
    footer={p => (
      <CardContent className='content'>
        <Form memeId={p.meme.id} autofocus
          onDone={() => {
            p.self.nextLocation(true)
          }}
        />
      </CardContent>
    )}
    nextButton
  />
)