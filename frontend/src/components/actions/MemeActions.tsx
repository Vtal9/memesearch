import React from 'react'
import { FullMeme, AuthState, ForeignMeme, VisibleForeign } from "../../util/Types"
import { AddRemove, FakeAdd } from "./AddRemove"
import { Copy } from './Copy'
import { ExtraMarkup, FakeMarkup } from './ExtraMarkup'
import { TagsEdit, FakeTagsEdit } from './TagsEdit'
import { isForeign, isNative } from '../../util/Funcs'
import MyMemes from '../../pages/MyMemes'


type Props = {
  authState: AuthState
  meme: FullMeme | VisibleForeign
  edit?: boolean
  big?: boolean
}

export default (props: Props) => {
  const size = props.big ? 'medium' : 'small'
  return (
    props.authState.status === 'yes' ? (
      <div className='actions'>
        {isNative(props.meme) &&
          <AddRemove
            size={size}
            id={props.meme.id}
            own={props.meme.owner.some(owner => 
              props.authState.status === 'yes' &&
              props.authState.user.id === owner.id
            )}
          />
        }
        <Copy img={props.meme.img} size={size} />
        {isNative(props.meme) && props.edit && <ExtraMarkup id={props.meme.id} size={size} />}
        {isNative(props.meme) && props.edit && <TagsEdit id={props.meme.id} size={size} />}
      </div>
    ) : (
      <div className="actions">
        {isNative(props.meme) && <FakeAdd size={size} />}
        <Copy size={size} img={props.meme.img} />
        {isNative(props.meme) && props.edit && <FakeMarkup size={size} />}
        {isNative(props.meme) &&props.edit && <FakeTagsEdit size={size} />}
      </div>
    )
  )
}