import React from 'react'


export default function AddTag() {
  return (
    <form action='tags/api/create' method='POST' autoComplete='off'>
      <input name='tag' autoFocus />
    </form>
  )
}