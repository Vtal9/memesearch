import React, { FormEvent } from 'react'
import Center from '../layout/Center';
import { TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Repo, AuthState, UnloadedMeme } from '../util/Types';
import BigFont from '../layout/BigFont';
import FlexCenter from '../layout/FlexCenter';
import MySwitch from '../components/MySwitch';
import Gallery from '../components/Gallery';
import TagsPicker from '../components/TagsPicker';
import { Tag } from '../components/TagsForm';


type SearchServerResponse = { id?: string, url: string }[]

type Request =
| { extended: false, q: string }
| { extended: true, tags: Tag[], qText: string, qImage: string }

function search(request: Request, repo: Repo) {
  const qText = request.extended ? request.qText : request.q
  const qImage = request.extended ? request.qImage : request.q
  const usp = new URLSearchParams()
  usp.append('qText', qText)
  usp.append('qImage', qImage)
  if (request.extended) {
    usp.append('tags', request.tags.map(tag => tag.id).join(','))
  }
  const headers = repo === Repo.Own ? {
    Authorization: `Token ${Funcs.getToken()}`
  } : {}
  const api = repo === Repo.Own ? 'search/api/search/own' : 'search/api/search'
  return new Promise<SearchServerResponse>((resolve, reject) => {
    Axios.get(api + '/?' + usp, {
      headers
    }).then(response => {
      resolve(response.data)
    }).catch(function(error) {
      if (error.response && error.response.data) {
        resolve(error.response.data)
      } else {
        reject()
      }
    })
  })
}

interface SearchProps extends React.Attributes, WithSnackbarProps {
  authState: AuthState
  query: string
}

interface SearchState {
  query: string
  imageQuery: string
  textQuery: string
  extended: boolean
  state: 'initial' | 'loading' | 'done' | 'error'
  results: UnloadedMeme[],
  tags: Tag[],
  amongOwnFlag: boolean
}

class Search extends React.Component<SearchProps, SearchState> {
  state: SearchState = {
    query: this.props.query,
    imageQuery: '',
    textQuery: '',
    extended: false,
    state: 'initial',
    results: [],
    tags: [],
    amongOwnFlag: false
  }

  get repo() {
    return (this.props.authState.status === 'yes' && this.state.amongOwnFlag) ? Repo.Own : Repo.Public
  }

  performSearch(e: FormEvent | null = null) {
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
      if (this.state.query.trim() === '') {
        return
      }
    }
    const request: Request = this.state.extended ? {
      extended: true,
      qImage: this.state.imageQuery,
      qText: this.state.textQuery,
      tags: this.state.tags
    } : {
      extended: false, q: this.state.query
    }
    
    this.setState({ state: 'loading' })
    search(request, this.repo).then(items => {
      this.setState({
        state: 'done',
        results: items.map(item => {
          if (item.id !== undefined) {
            return { type: 'native', id: parseInt(item.id), url: item.url }
          } else {
            return { type: 'external', url: item.url }
          }
        })
      })
    }).catch(() => {
      this.setState({ state: 'error' })
    })
  }

  componentDidMount() {
    this.performSearch()
  }

  render() {
    return (
      <Center>
        <form onSubmit={e => this.performSearch(e)}>
          <Grid container spacing={2} style={{width: '100%'}}>
            <Grid item style={{ flex: 1 }}>
              {this.state.extended ?
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField value={this.state.imageQuery}
                      onChange={e => this.setState({ imageQuery: e.target.value })}
                      label='Что изображено?' fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField value={this.state.textQuery}
                      onChange={e => this.setState({ textQuery: e.target.value })}
                      label='Что написано?' fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TagsPicker
                      tags={this.state.tags}
                      onChange={tags => this.setState({ tags }, this.performSearch)}
                    />
                  </Grid>
                </Grid>
              :
                <TextField value={this.state.query} onChange={e => this.setState({ query: e.target.value })}
                  fullWidth autoFocus label='Какой мем ищете?' />
              }
              <MySwitch value={this.state.extended} label='Расширенный поиск'
                onChange={checked => {
                  if (checked && this.state.textQuery === '' && this.state.imageQuery == '') {
                    this.setState({ textQuery: this.state.query, imageQuery: this.state.query })
                  }
                  this.setState({ extended: checked }, this.performSearch)
                }} />
              <MySwitch
                value={this.state.amongOwnFlag && this.props.authState.status === 'yes'}
                label='Поиск по личной коллекции'
                onChange={checked => {
                  if (checked && this.props.authState.status !== 'yes') {
                    this.props.enqueueSnackbar('Пожалуйста, авторизуйтесь')
                  } else {
                    this.setState({ amongOwnFlag: checked }, this.performSearch)
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Button variant='contained' color='primary' type='submit'
                disabled={this.state.state === 'loading'}
              >Искать</Button>
            </Grid>
          </Grid>
        </form>
        <div className='gallery'>
          {this.state.state === 'loading' &&
            <FlexCenter><CircularProgress /></FlexCenter>
          }
          {this.state.results.length === 0 && this.state.state === 'done' &&
            <BigFont>Таких мемов не нашлось</BigFont>
          }
          {this.state.state === 'error' &&
            <BigFont>Ошибка сервера, попробуйте ещё раз</BigFont>
          }
          <Gallery list={this.state.results} authState={this.props.authState} />
        </div>
      </Center>
    )
  }
}

export default withSnackbar(Search)