import React from 'react'
import Types from "./Types";
import { WithSnackbarProps } from "notistack";
import { Button } from "@material-ui/core";

export default {
  axiosError(error: any) {
    let msg: string = error.message
    const snackbarError: Types.SnackbarError = { msg, short: true }

    switch (msg) {
    case 'Network Error':
      msg = 'Нет интернета'
      break
    }
    if (error.response) {
      let more = error.response.data
      const type = error.response.headers['content-type']
      if (typeof type === 'string') {
        const [ mime, ] = type.split(';')
        switch (mime.trim()) {
        case 'application/json':
          more = JSON.stringify(more)
          break
        }
      }
      msg += ': ' + more
      snackbarError.short = false
    }

    snackbarError.msg = msg
    return snackbarError
  },

  showSnackbarAxiosError(context: WithSnackbarProps, error: Types.SnackbarError) {
    console.log(error)
    context.enqueueSnackbar(error.msg, {
      autoHideDuration: 5000,
      persist: !error.short,
      action: key => (
        <Button onClick={() => context.closeSnackbar(key)} color='secondary'>Закрыть</Button>
      )
    })
  }
}