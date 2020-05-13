import React from 'react'
import { TextField, InputAdornment, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'


type Props = {
  onSearch: (q: string) => void
}

type State = {
  query: string
  error: boolean
}

export default class QuickSearch extends React.Component<Props, State> {
  state: State = {
    query: '',
    error: false
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (this.state.query.trim() === '') {
      this.setState({ error: true })
    } else {
      this.props.onSearch(this.state.query)
    }
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <TextField
          label='Поиск'
          value={this.state.query}
          onChange={e => this.setState({ query: e.target.value })}
          error={this.state.error}
          InputProps={{
            endAdornment:
              <InputAdornment position='end'>
                <IconButton onClick={e => this.handleSubmit(e)}><SearchIcon /></IconButton>
              </InputAdornment>
          }}
        />
      </form>
    )
  }
}