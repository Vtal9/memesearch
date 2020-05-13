import React from 'react'
import { PageProps } from './PageProps'


export default function(_: PageProps) {
  return (
    <form action='tags/api/create' method='POST' autoComplete='off'>
      <input name='tag' autoFocus />
    </form>
  )
}