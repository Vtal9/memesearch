import React, { FormEvent } from 'react'
import { TextField, Grid, Button, Icon, Typography } from '@material-ui/core';
import Axios, { AxiosResponse } from 'axios'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { authHeader } from '../../util/Funcs';


function updateDescription(id: number, textDescription: string, imageDescription: string, concat?: boolean) {
  return new Promise<{}>((resolve, reject) => {
    let promise: Promise<AxiosResponse>

    if (concat) {
      const urlData = new URLSearchParams()
      urlData.append('image', imageDescription)
      urlData.append('text', textDescription)
      urlData.append('id', id + '')
      promise = Axios.post(`api/updateMeme?` + urlData, {}, {
        headers: authHeader()
      })
    } else {
      promise = Axios.patch(`api/memes/${id}/`, {
        imageDescription, textDescription
      })
    }
    
    promise.then(function(response) {
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

interface FormProps extends WithSnackbarProps {
  memeId: number | false
  onDone?: () => void
  initialImageDescription?: string
  initialTextDescription?: string
  autofocus?: boolean
  concat?: boolean
}

interface FormState {
  imageDescription: string
  textDescription: string
  descriptionError: boolean
  state: 'initial' | 'saving' | 'saved'
}

class Form extends React.Component<FormProps, FormState> {
  state: FormState = {
    state: 'initial',
    imageDescription: this.props.initialImageDescription || '',
    textDescription: this.props.initialTextDescription || '',
    descriptionError: false
  }

  handleSubmit(e: React.FormEvent | undefined = undefined) {
    if (e) e.preventDefault()
    if (this.props.memeId === false) return

    if (!this.props.concat && this.state.imageDescription.trim() === '') {
      this.setState({ descriptionError: true })
      return
    }

    this.setState({ state: 'saving' })
    updateDescription(
      this.props.memeId,
      this.state.textDescription,
      this.state.imageDescription,
      this.props.concat
    ).then(() => {
      this.setState({ state: 'saved' })
      if (this.props.onDone) this.props.onDone()
    }).catch(() => {
      this.setState({ state: 'initial' })
      this.props.enqueueSnackbar('Нет интернета')
    })
  }

  render() {
    return (
      <form onSubmit={(e: FormEvent) => this.handleSubmit(e)}>
        <Grid container className='inputs' spacing={2}>
          <Grid item xs>
            <TextField fullWidth multiline
              error={this.state.descriptionError}
              autoFocus={this.props.autofocus}
              value={this.state.imageDescription}
              onChange={e => {
                this.setState({ imageDescription: e.target.value })
              }}
              onKeyDown={e => {
                if (e.ctrlKey && e.keyCode == 13) {
                  this.handleSubmit()
                }
              }}
              label='Что изображено?' helperText={<span>
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
                  this.handleSubmit()
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
              disabled={this.props.memeId === false || this.state.state === 'saving'}
              startIcon={<Icon>done</Icon>}
            >Готово</Button>
          </Grid>
        </Grid>
      </form>
    )
  }
}

export const CenterPadding: React.FC = props => (
  <div style={{
    justifyContent: 'center',
    padding: 20,
    display: 'flex',
    width: '100%'
  }}>
    {props.children}
  </div>
)

export default withSnackbar(Form)