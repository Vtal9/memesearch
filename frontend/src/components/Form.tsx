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

  handleSubmit(e: React.FormEvent | undefined) {
    if (e) e.preventDefault()

    if (!this.props.meme) return

    if (badDescription(this.state.imageDescription)) {
      this.setState({ imageDescriptionError: true })
      return
    }

    this.setState({ state: 'saving' })
    const self = this
    Axios.patch('api/memes/' + this.props.meme.id + '/', {
      imageDescription: this.state.imageDescription,
      textDescription: this.state.textDescription
    }).then(function(response) {
      self.setState({ state: 'saved' })
      if (self.props.onDone) self.props.onDone()
    }).catch(function(error) {
      self.setState({ state: 'initial' })
      const errorObj = Funcs.axiosError(error)
      if (!errorObj.resolved) {
        errorObj.msg = 'Неизвестная ошибка'
        errorObj.short = true
      }
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
                label='Что изображено?' helperText={<span>
                  Описание картинки, ключевые объекты, важные для поиска.<br />
                  Например: &laquo;негр; бегущий школьник; постирония&raquo;.<br />
                  Разные сущности разделяйте переносом строки
                </span>} />
            </Grid>
            <Grid item xs>
              <TextField fullWidth multiline
                value={this.state.textDescription}
                onChange={e => this.setState({ textDescription: e.target.value })}
                label='Что написано?' helperText='Разные надписи разделяйте переносом строки' />
            </Grid>
          </Grid>
          <Grid container spacing={2} justify='flex-end'>
            <Grid item>
              <Button variant='contained' onClick={() => {
                this.setState({ imageDescription: 'Это не мем' }, () => {
                  this.handleSubmit(undefined)
                })
              }}
                {...(this.state.state === 'saving' && { disabled: true })}
              >Это не мем</Button>
            </Grid>
            <Grid item>
              <Button variant='contained' color='primary' type='submit'
                {...(this.state.state === 'saving' && { disabled: true })}
                startIcon={<Icon>done</Icon>}
              >Готово</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

export default withSnackbar(Form)