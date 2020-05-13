import React from 'react'
import { FullMeme, AuthState } from "../../util/Types"
import { AddRemove, FakeAdd } from "./AddRemove"
import { Copy } from './Copy'
import { ExtraMarkup, FakeMarkup } from './ExtraMarkup'
import { TagsEdit, FakeTagsEdit } from './TagsEdit'


type Props = {
  authState: AuthState
  meme: FullMeme
  edit?: boolean
  big?: boolean
}

export default (props: Props) => {
  const size = props.big ? 'medium' : 'small'
  return (
    props.authState.status === 'yes' ? (
      <div className='actions'>
        <AddRemove
          size={size}
          id={props.meme.id}
          own={props.meme.owner.some(owner => 
            props.authState.status === 'yes' &&
            props.authState.user.id === owner.id
          )}
        />
        <Copy img={props.meme.img} size={size} />
        {props.edit && <ExtraMarkup id={props.meme.id} size={size} />}
        {props.edit && <TagsEdit id={props.meme.id} size={size} />}
      </div>
    ) : (
      <div className="actions">
        <FakeAdd size={size} />
        <Copy size={size} img={props.meme.img} />
        {props.edit && <FakeMarkup size={size} />}
        {props.edit && <FakeTagsEdit size={size} />}
      </div>
    )
  )
}