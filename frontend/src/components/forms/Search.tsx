import React from 'react'
import { TextField, Grid, Button, Paper } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { AuthState } from '../../util/Types';
import Switch from '../inputs/MySwitch';
import TagsPicker from '../inputs/TagsPicker';
import { Tag, SearchRequest } from '../../util/Types';
import AddIcon from '@material-ui/icons/Add';


interface Props extends React.Attributes, WithSnackbarProps {
  authState: AuthState
  query: string
  onRequest: (r: SearchRequest) => void
  disabled: boolean
}

interface State {
  query: string
  imageQuery: string
  textQuery: string
  extended: boolean
  tags: Tag[]
  own: boolean
}

class Search extends React.Component<Props, State> {
  state: State = {
    query: this.props.query,
    imageQuery: '',
    textQuery: '',
    extended: false,
    tags: [],
    own: false
  }

  performSearch(e: React.FormEvent | null = null) {
    if (e) {
      e.preventDefault()
    }
    if (this.state.extended) {
      if (this.state.imageQuery.trim() === ''
        && this.state.textQuery.trim() === ''
        && this.state.tags.length === 0) {
        return
      }
    } else {
      if (this.state.query.trim() === ''
        && this.state.tags.length === 0) {
        return
      }
    }
    const request: SearchRequest = this.state.extended ? {
      extended: true,
      qImage: this.state.imageQuery,
      qText: this.state.textQuery,
      tags: this.state.tags,
      own: this.state.own
    } : {
      extended: false,
      q: this.state.query,
      tags: this.state.tags,
      own: this.state.own
    }
    this.props.onRequest(request)
  }

  componentDidMount() {
    this.performSearch()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authState.status === 'yes' && this.props.authState.status !== 'yes') {
      this.setState({ own: false })
    }
  }

  render() {
    return (
      <Paper component='form' onSubmit={e => this.performSearch(e)} className='search-controls'>
        <div className='row' style={{ justifyContent: 'space-between' }}>
          {this.state.extended ? (
            <div className='text-fields control'>
              <TextField value={this.state.textQuery}
                onChange={e => this.setState({ textQuery: e.target.value })}
                label='Что написано?' fullWidth />
              <div className='small-spacing' />
              <TextField value={this.state.imageQuery}
                onChange={e => this.setState({ imageQuery: e.target.value })}
                label='Что изображено?' fullWidth />
            </div>
            ) : (
            <div className='text-fields control'>
              <TextField value={this.state.query} onChange={e => this.setState({ query: e.target.value })}
                fullWidth autoFocus label='Какой мем ищете?' />
            </div>
          )}
        </div>
        <div className='row'>
          <div className='button control'>
            <Button variant='contained' color='primary' type='submit'
              disabled={this.props.disabled}
            >Искать</Button>
          </div>
          <div className='switches control'>
            <Switch value={this.state.extended} label='Расширенный поиск'
              onChange={checked => {
                if (checked && this.state.textQuery === '' && this.state.imageQuery == '') {
                  this.setState({ textQuery: this.state.query, imageQuery: this.state.query })
                }
                this.setState({ extended: checked }, this.performSearch)
              }} />
            <Switch
              value={this.state.own}
              label='Поиск по личной коллекции'
              onChange={checked => {
                if (checked && this.props.authState.status !== 'yes') {
                  this.props.enqueueSnackbar('Пожалуйста, авторизуйтесь')
                } else {
                  this.setState({ own: checked }, this.performSearch)
                }
              }}
            />
          </div>
        </div>
        <div className='row control'>
          <TagsPicker
            tags={this.state.tags}
            onChange={tags => this.setState({ tags }, this.performSearch)}
          >Выбрать теги</TagsPicker>
        </div>
      </Paper>
    )
  }
}

export default withSnackbar(Search)