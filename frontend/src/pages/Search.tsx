import React, { FormEvent } from 'react'
import Center from '../layout/Center';
import { Typography, TextField, Grid, Button, FormControlLabel, Switch, FormControl, CircularProgress } from '@material-ui/core';
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Types from '../util/Types';
import BigFont from '../layout/BigFont';
import FlexCenter from '../layout/FlexCenter';
import { Store } from 'redux';
import { authState } from '../components/AuthBar';


export interface SearchProps extends React.Attributes, WithSnackbarProps {
  authStore: Store<Types.AuthState>
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
  authState: Types.AuthState
  self: boolean
}

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      query: props.query,
      imageQuery: '',
      textQuery: '',
      extended: false,
      state: 'initial',
      results: [],
      self: false,
      authState: props.authStore.getState()
    }
    props.authStore.subscribe(() => this.setState({ authState: props.authStore.getState() }))
  }

  performSearch(e: FormEvent | null = null) {
    console.log('test')
    if (e) {
      e.preventDefault()
    }
    const qText = this.state.extended ? this.state.textQuery : this.state.query
    const qImage = this.state.extended ? this.state.imageQuery : this.state.query
    if (qText.trim() === '' && qImage.trim() === '') {
      return
    }
    this.setState({ state: 'loading' })
    const self = this
    const headers = this.state.self ? {
      Authorization: `Token ${Funcs.getToken()}`
    } : {}
    const api = this.state.self ? 'search/api/search/own' : 'search/api/search'
    Axios.get(`${api}/?qText=${encodeURIComponent(qText)}&qImage=${encodeURIComponent(qImage)}`, {
      headers
    }).then(function(response) {
      self.setState({
        state: 'done',
        results: response.data.map((item: any) => {
          return { id: item.id, img: null }
        })
      })
      response.data.forEach((item: any) => {
        Axios.get(`api/memes/${item.id}/`).then(response => {
          Funcs.loadImage(response.data.id, response.data.url, img => {
            self.setState(oldState => {
              return {
                results: oldState.results.map(meme =>
                  meme.id === item.id ? {...meme, img: img} : meme
                )
              }
            })
          }, () => {})
        })
      })
    }).catch(function(error) {
      // const errorObj = Funcs.axiosError(error)
      // if (!errorObj.resolved) {
      //   errorObj.msg = 'Неизвестная ошибка'
      //   errorObj.short = true
      // }
      // Funcs.showSnackbarAxiosError(self.props, Funcs.axiosError(error))
      self.setState({ state: 'done', results: [] })
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
              <FormControlLabel control={
                <Switch checked={this.state.extended} color='primary'
                  onChange={e => {
                    const checked = e.target.checked
                    if (checked && this.state.textQuery === '' && this.state.imageQuery == '') {
                      this.setState({ textQuery: this.state.query, imageQuery: this.state.query })
                    }
                    this.setState({ extended: checked })
                  }} />
              } label={
                <Typography color={this.state.extended ? 'textPrimary' : 'textSecondary'}>Расширенный поиск</Typography>
              } />
              <FormControlLabel control={
                <Switch checked={this.state.self} color='primary'
                  onChange={e => {
                    const checked = e.target.checked
                    if (checked && this.state.authState.status !== 'yes') {
                      this.props.enqueueSnackbar('Это опция доступна только при наличии аккаунта. ' +
                      'Войдите, и вы сможете искать по своим мемам')
                    } else {
                      this.setState({ self: checked })
                    }
                  }} />
              } label={
                <Typography color={this.state.self ? 'textPrimary' : "textSecondary"}>Поиск по личной коллекции</Typography>
              } />
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