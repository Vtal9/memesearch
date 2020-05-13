import React from 'react'
import { PageProps } from './PageProps'
import GeneralizedMemePage from './GeneralizedMemePage'
import { unmarkedApi } from '../api/MemesLists'
import { CardContent } from '@material-ui/core'
import Form from '../components/meme/DescriptionForm'
import { PureMeme } from '../util/Types'


export default (props: PageProps) => (
  <GeneralizedMemePage {...props}
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