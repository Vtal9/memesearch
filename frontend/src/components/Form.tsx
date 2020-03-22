import React from 'react'
import { TextField, Card, CardMedia, CardContent, Grid, Button, Icon, Typography, CircularProgress } from '@material-ui/core';
import Axios from 'axios'
import Types from '../util/Types'


function badDescription(d: string) {
  return d.trim() === ''
}

export interface FormProps extends React.Attributes {
  meme: Types.Meme
  onDone?: () => void
  signle?: boolean
}

interface FormState {
  imageDescription: string
  textDescription: string
  imageDescriptionError?: boolean
  state: 'initial' | 'saving' | 'error' | 'saved'
}

export default class Form extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      state: 'initial',
      imageDescription: props.meme.imageDescription,
      textDescription: props.meme.textDescription
    }
  }

  handleSubmit() {
    if (!this.props.meme) return

    if (this.state.imageDescriptionError) return

    this.setState({ state: 'saving' })
    const self = this
    Axios.patch('/api/memes/' + this.props.meme.id + '/', {
      imageDescription: this.state.imageDescription,
      textDescription: this.state.textDescription
    }).then(function(response) {
      self.setState({ state: 'saved' })
      if (self.props.onDone) self.props.onDone()
    }).catch(function(error) {
      self.setState({ state: 'error' })
    })
  }

  render() {
    const { meme, signle } = this.props
    return (
      <Card className={signle ? 'meme-form single' : 'meme-form'} component='form' onSubmit={() => this.handleSubmit()}>
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
                label='Что изображено?' helperText='Описание картинки, ключевые объекты. Например: &laquo;негр, бегущий школьник&raquo;' />
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
            startIcon={<Icon>done</Icon>}>Готово</Button>
          {this.state.state === 'error' &&
            <Typography variant='caption' color='error' className='error'>Случилась ошибка. Попробуйте ещё раз.</Typography>
          }
        </CardContent>
      </Card>
    )
  }
}