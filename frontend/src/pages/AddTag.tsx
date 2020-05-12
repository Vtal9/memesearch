import React from 'react'
import { PageProps } from './PageProps'
import { withRouter } from 'react-router-dom'


export default withRouter(function(_: PageProps) {
  return (
    <form action='tags/api/create' method='POST' autoComplete='off'>
      <input name='tag' autoFocus />
    </form>
  )
})