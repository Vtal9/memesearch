import React from 'react'
import { TextField, Card, CardMedia, CardContent, Grid, Button, Icon, Typography, CircularProgress } from '@material-ui/core';
import Axios from 'axios'
import Types from '../util/Types'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Funcs from '../util/Funcs';


function badDescription(d: string) {
  return d.trim() === ''
}

export interface FormProps extends React.Attributes, WithSnackbarProps {
  meme: Types.Meme
  onDone?: () => void
  signle?: boolean
}

interface FormState {
  imageDescription: string
  textDescription: string
  imageDescriptionError?: boolean
  state: 'initial' | 'saving' | 'saved'
}

class Form extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      state: 'initial',
      imageDescription: props.meme.imageDescription,
      textDescription: props.meme.textDescription
    }
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!this.props.meme) return

    if (badDescription(this.state.imageDescription)) {
      this.setState({ imageDescriptionError: true })
      return
    }

    this.setState({ state: 'saving' })
    const self = this
    Axios.patch('/api/memes/' + this.props.meme.id + '/', {
      imageDescription: this.state.imageDescription,
      textDescription: this.state.textDescription
    }).then(function(response) {
      self.setState({ state: 'saved' })
      if (self.props.onDone) self.props.onDone()
    }).catch(function(error) {
      self.setState({ state: 'initial' })
      Funcs.showSnackbarAxiosError(self.props, Funcs.axiosError(error))
    })
  }

  render() {
    const { meme, signle } = this.props
    return (
      <Card className={signle ? 'meme-form single' : 'meme-form'}
        component='form' onSubmit={e => this.handleSubmit(e)}
      >
        <CardMedia component='img' className='img' image={meme.img.src} style={{ objectFit: 'contain' }} />
        <CardContent className='control'>
          {!this.props.signle &&
            <div className='caption'>
              <Typography variant='caption'>Мем загружен на сервер. Вы можете сразу же его здесь разметить.</Typography>
            </div>
          }
          <Grid container className='inputs' spacing={2}>
            <Grid item xs>
              <TextField fullWidth multiline error={this.state.imageDescriptionError} autoFocus={signle}
                value={this.state.imageDescription}
                onChange={e => {
                  const d = e.target.value
                  this.setState({ imageDescription: d, imageDescriptionError: badDescription(d) })
                }}
                label='Что изображено?' helperText='Описание картинки, ключевые объекты, важные для поиска. Например: &laquo;негр, бегущий школьник&raquo;' />
            </Grid>
            <Grid item xs>
              <TextField fullWidth multiline
                value={this.state.textDescription}
                onChange={e => this.setState({ textDescription: e.target.value })}
                label='Что написано?' />
            </Grid>
          </Grid>
          <Button variant='contained' color='primary' type='submit'
            {...(this.state.state === 'saving' && { disabled: true })}
            startIcon={<Icon>done</Icon>}
          >Готово</Button>
        </CardContent>
      </Card>
    )
  }
}

export default withSnackbar(Form)