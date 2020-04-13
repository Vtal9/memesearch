import React, { FormEvent } from 'react'
import Center from '../layout/Center';
import { Typography, TextField, Grid, Button, FormControlLabel, Switch, FormControl, CircularProgress } from '@material-ui/core';
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Repo, AuthState } from '../util/Types';
import BigFont from '../layout/BigFont';
import FlexCenter from '../layout/FlexCenter';
import MySwitch from '../components/MySwitch';


type SearchServerResponse = { id: number }[]

type Request =
| { extended: false, q: string }
| { extended: true, qText: string, qImage: string }

function search(request: Request, repo: Repo) {
  const qText = request.extended ? request.qText : request.q
  const qImage = request.extended ? request.qImage : request.q
  const headers = repo === Repo.Own ? {
    Authorization: `Token ${Funcs.getToken()}`
  } : {}
  const api = repo === Repo.Own ? 'search/api/search/own' : 'search/api/search'
  return new Promise<SearchServerResponse>((resolve, reject) => {
    Axios.get(`${api}/?qText=${encodeURIComponent(qText)}&qImage=${encodeURIComponent(qImage)}`, {
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

interface OnlyMeme {
  id: number
  img: HTMLImageElement | null
}

interface SearchState {
  query: string
  imageQuery: string
  textQuery: string
  extended: boolean
  state: 'initial' | 'loading' | 'done'
  results: OnlyMeme[]
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
      if (this.state.imageQuery.trim() === '' || this.state.textQuery.trim() === '') {
        return
      }
    } else {
      if (this.state.query.trim() === '') {
        return
      }
    }
    const request: Request = this.state.extended ? {
      extended: true, qImage: this.state.imageQuery, qText: this.state.textQuery
    } : {
      extended: false, q: this.state.query
    }
    
    this.setState({ state: 'loading' })
    search(request, this.repo).then(items => {
      this.setState({
        state: 'done',
        results: items.map(item => {
          Axios.get(`api/memes/${item.id}/`).then(response => {
            Funcs.loadImage(response.data.id, response.data.url, img => {
              this.setState(oldState => {
                return {
                  results: oldState.results.map(meme =>
                    meme.id === item.id ? {...meme, img: img} : meme
                  )
                }
              })
            }, () => {})
          })
          return { id: item.id, img: null }
        })
      })
    }).catch(() => {
      this.setState({ state: 'done', results: [] })
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
                  this.setState({ extended: checked })
                }} />
              <MySwitch
                value={this.state.amongOwnFlag && this.props.authState.status === 'yes'}
                label='Поиск по личной коллекции'
                onChange={checked => {
                  if (checked && this.props.authState.status !== 'yes') {
                    this.props.enqueueSnackbar('Пожалуйста, авторизуйтесь')
                  } else {
                    this.setState({ amongOwnFlag: checked })
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
          {this.state.results.map(meme =>
            meme.img !== null ?
              <img src={meme.img.src} className='gallery-item' key={meme.id} />
            :
              <CircularProgress key={meme.id} className='gallery-item' />
          )}
        </div>
      </Center>
    )
  }
}

export default withSnackbar(Search)