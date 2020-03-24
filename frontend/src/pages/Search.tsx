import React from 'react'
import Center from '../layout/Center';
import { TextField } from '@material-ui/core';
import Axios from 'axios';
import Types from '../util/Types';


export default class Search extends React.Component<{}, { q: string, results: any[] }> {
  constructor(props: {}) {
    super(props)
    this.state = { q: '', results: [] }
  }

  makeRequest() {
    const self = this
    if (this.state.q.trim() === '') return
    Axios.get('api/memes/').then(function(response) {
      self.setState({ results: response.data.filter((item: any) => (
        (item.textDescription as string).indexOf(self.state.q) !== -1
        ||
        (item.imageDescription as string).indexOf(self.state.q) !== -1
      )) })
    })
  }

  render() {
    return (
      <Center>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            value={this.state.q}
            onChange={e => {
              this.setState({ q: e.target.value })
              this.makeRequest()
            }}
          />
        </div>
        <div>
          {this.state.results.map(meme =>
            <img src={meme.image} style={{ height: 300 }} />
          )}
        </div>
      </Center>
    )
  }
}