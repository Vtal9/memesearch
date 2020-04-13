import React from 'react'
import { User, SnackbarError } from "./Types";
import { WithSnackbarProps } from "notistack";
import { Button } from "@material-ui/core";
import Axios from 'axios';


const TOKEN_KEY = 'memesearch_token'

export default {
  showSnackbarError(context: WithSnackbarProps, error: SnackbarError) {
    context.enqueueSnackbar(error.msg, {
      autoHideDuration: 5000,
      persist: !error.short,
      action: key => (
        <Button onClick={() => context.closeSnackbar(key)} color='secondary'>Закрыть</Button>
      )
    })
  },

  loadImage(id: number, src: string, success: (img: HTMLImageElement) => void, failure: () => void) {
    const img = new Image()
    img.onload = () => success(img)
    img.onerror = () => {
      Axios.get(`api/new_meme_url/?id=${id}`).then(function(response) {
        const second = new Image()
        second.onload = () => success(second)
        second.onerror = failure
        second.src = response.data[0].url
      }).catch(failure)
    }
    img.src = src
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  checkToken(success: (u: User) => void, failure: () => void) {
    const token = this.getToken()
    Axios.get('accounts/api/auth/user', {
      headers: {
        Authorization: `Token ${token}`
      }
    }).then(response => success({
      id: response.data.id,
      username: response.data.username
    })).catch(failure)
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  unsetToken() {
    localStorage.removeItem(TOKEN_KEY)
  }
}