import React from 'react'
import { Repo, AuthState, SearchRequest, PureMeme } from '../util/Types';
import SearchForm from '../components/SearchForm';
import Center from '../layout/Center';
import FlexCenter from '../layout/FlexCenter';
import { CircularProgress } from '@material-ui/core';
import BigFont from '../layout/BigFont';
import Gallery from '../components/gallery/Gallery';
import { searchApi } from '../api/Search'


type Props = {
  authState: AuthState
  query: string
}

type State = {
  status: 'initial' | 'loading' | 'done' | 'error'
  results: PureMeme[]
}

export default class Search extends React.Component<Props, State> {
  state: State = {
    status: 'initial',
    results: []
  }

  async handleRequest(request: SearchRequest) {
    this.setState({ status: 'loading' })
    const repo = request.own ? Repo.Own : Repo.Public
    try {
      const items = await searchApi(request, repo)
      this.setState({
        status: 'done',
        results: items
      })
    } catch {
      this.setState({ status: 'error' })
    }
  }

  render() {
    return (
      <Center>
        <div className='spacing'></div>
        <SearchForm
          authState={this.props.authState}
          query={this.props.query}
          onRequest={request => this.handleRequest(request)}
          disabled={this.state.status === 'loading'}
        />
        <div className='gallery'>
          {this.state.status === 'loading' &&
            <FlexCenter><CircularProgress /></FlexCenter>
          }
          {this.state.results.length === 0 && this.state.status === 'done' &&
            <BigFont>Таких мемов не нашлось</BigFont>
          }
          {this.state.status === 'error' &&
            <BigFont>Ошибка сервера, попробуйте ещё раз</BigFont>
          }
          <Gallery list={this.state.results} authState={this.props.authState} />
        </div>
      </Center>
    )
  }
}