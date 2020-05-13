import React from 'react'
import { TextField, Button, Typography } from '@material-ui/core';
import Axios from 'axios';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import CheckIcon from '@material-ui/icons/Check';


const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default withSnackbar(function Subscription(props: WithSnackbarProps) {
  const [ email, setEmail ] = React.useState('')
  const [ incorrect, setError ] = React.useState(false)
  const [ done, setDone ] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.match(email_regex)) {
      setError(true)
    } else {
      Axios.post('emails/emails/', {
        Email: email
      }).then(response => {
        setDone(true)
      }).catch(error => {
        props.enqueueSnackbar('Неизвестная ошибка')
      })
    }
  }

  return (
    done ? (
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <CheckIcon />
        <Typography>Подписка оформлена</Typography>
      </div>
    ) : (
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField value={email} label='Email' error={incorrect} type='email'
          onChange={e => {
            setError(false)
            setEmail(e.target.value)
          }} />
        <Button type='submit' variant='contained' color='primary'>OK</Button>
      </form>
    )
  )
})
