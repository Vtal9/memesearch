import React from 'react'
import { getTags } from './TagsForm'
import { Chip, Typography, Button, MenuItem, Menu, Icon } from '@material-ui/core'
import { Tag } from '../util/Types'


type Props = {
  tags: Tag[],
  onChange?: (tags: Tag[]) => void
}

type State = {
  status:
  | { readonly type: 'loading' | 'error' }
  | { type: 'done', tags: Tag[] }
  menuAnchor: HTMLElement | null
}

function has(list: Tag[], tag: Tag) {
  return list.reduce((contains, current) => (
    contains || current.id == tag.id
  ), false)
}

export default class TagsFilter extends React.Component<Props, State> {
  state: State = {
    status: { type: 'loading' },
    menuAnchor: null
  }

  async load() {
    this.setState({ status: { type: 'loading' } })
    try {
      const allTags = await getTags()
      this.setState({
        status: { type: 'done', tags: allTags.filter(tag => !has(this.props.tags, tag)) }
      })
    } catch {
      this.setState({
        status: { type: 'error' }
      })
    }
  }

  componentDidMount() {
    this.load()
  }

  render() {
    switch (this.state.status.type) {
    case 'loading':
      return <Typography color='textSecondary'>Загрузка тегов...</Typography>
    case 'error':
      return (
        <div className='vmiddle'>
          <Typography color='error'>Ошибка при загрузке тегов</Typography>
          <Button color='primary' onClick={() => this.load()}>Попробовать ещё раз</Button>
        </div>
      )
    case 'done':
      return (
        <div>
        {this.props.tags.map(item => (
          <Chip
            className='tag-chip'
            key={item.id}
            label={item.tag}
            onDelete={() => {
              this.setState(oldState => {
                if (oldState.status.type === 'done') {
                  const newState: State = {
                    menuAnchor: null,
                    status: {
                      type: 'done',
                      tags: [...oldState.status.tags, item]
                    }
                  }
                  return newState
                } else return oldState
              }, () => {
                if (this.props.onChange) {
                  this.props.onChange(this.props.tags.filter(tag => tag.id !== item.id))
                }
              })
            }}
          />
        ))}
        <Button
          variant='contained'
          size='small'
          startIcon={<Icon>remove</Icon>}
          onClick={e => this.setState({ menuAnchor: e.currentTarget })}
        >Тег</Button>
        <Menu
          anchorEl={this.state.menuAnchor}
          onClose={() => this.setState({ menuAnchor: null })}
          open={this.state.menuAnchor !== null}
        >
          {this.state.status.tags.map(item => (
            <MenuItem
              key={item.id}
              onClick={() => {
                this.setState(oldState => {
                  if (oldState.status.type === 'done') {
                    const newState: State = {
                      menuAnchor: null,
                      status: {
                        type: 'done',
                        tags: oldState.status.tags.filter(tag => tag.id !== item.id)
                      }
                    }
                    return newState
                  } else return oldState
                }, () => {
                  if (this.props.onChange) {
                    this.props.onChange([...this.props.tags, item])
                  }
                })
              }}
            >{item.tag}</MenuItem>
          ))}
        </Menu>
      </div>
      )
    }
  }
}