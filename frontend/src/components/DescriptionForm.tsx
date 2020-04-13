import React from 'react'
import { TextField, Card, CardMedia, CardContent, Grid, Button, Icon, Typography } from '@material-ui/core';
import Axios from 'axios'
import { Meme } from '../util/Types'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Funcs from '../util/Funcs';


function updateDescription(id: number, textDescription: string, imageDescription: string) {
  return new Promise<{}>((resolve, reject) => {
    Axios.patch(`api/memes/${id}/`, {
      imageDescription, textDescription
    }).then(function(response) {
      resolve()
    }).catch(function(error) {
      if (error.response && error.response.data) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

export interface FormProps extends React.Attributes, WithSnackbarProps {
  meme: Meme
  onDone?: () => void
  signle?: boolean
}

interface FormState {
  imageDescription: string
  textDescription: string
  descriptionError?: boolean
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

    if (this.state.imageDescription.trim() === '') {
      this.setState({ descriptionError: true })
      return
    }

    this.setState({ state: 'saving' })
    updateDescription(
      this.props.meme.id,
      this.state.textDescription,
      this.state.imageDescription
    ).then(() => {
      this.setState({ state: 'saved' })
      if (this.props.onDone) this.props.onDone()
    }).catch(() => {
      this.setState({ state: 'initial' })
      Funcs.showSnackbarError(this.props, { short: true, msg: 'Нет интернета' })
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
              <TextField fullWidth multiline error={this.state.descriptionError} autoFocus={signle}
                value={this.state.imageDescription}
                onChange={e => {
                  this.setState({ imageDescription: e.target.value })
                }}
                onKeyDown={e => {
                  if (e.ctrlKey && e.keyCode == 13) {
                    this.handleSubmit(undefined)
                  }
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
                onKeyDown={e => {
                  if (e.ctrlKey && e.keyCode == 13) {
                    this.handleSubmit(undefined)
                  }
                }}
                label='Что написано?' helperText='Разные надписи разделяйте переносом строки' />
            </Grid>
          </Grid>
          <Grid container spacing={2} justify='flex-end' alignItems='center'>
            <Grid item>
              <Typography variant='caption'>Ctrl + Enter</Typography>
              {/* <Button variant='contained' onClick={() => {
                this.setState({ imageDescription: 'Это не мем' }, () => {
                  this.handleSubmit(undefined)
                })
              }}
                {...(this.state.state === 'saving' && { disabled: true })}
              >Это не мем</Button> */}
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