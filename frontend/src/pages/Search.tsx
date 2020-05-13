import React from 'react'
import { Repo, SearchRequest, PureMeme } from '../util/Types';
import SearchForm from '../components/forms/Search';
import Center from '../layout/Center';
import FlexCenter from '../layout/FlexCenter';
import { CircularProgress, Paper } from '@material-ui/core';
import BigFont from '../layout/BigFont';
import Gallery from '../components/gallery/Gallery';
import { searchApi } from '../api/Search'
import { PageProps } from './PageProps';


type Props = {
  query: string
} & PageProps

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
    const q_ = new URLSearchParams(this.props.location.search).get('q')
    const q = q_ !== null ? q_ : ''
    return (
      <div>
        <Center>
          <div className='spacing' />
          <SearchForm
            authState={this.props.authState}
            query={q}
            onRequest={request => this.handleRequest(request)}
            disabled={this.state.status === 'loading'}
          />
        </Center>
        <Center>
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
      </div>
    )
  }
}