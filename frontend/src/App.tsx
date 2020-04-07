import React, { FormEvent } from 'react'
import { HashRouter as Router, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Center from './layout/Center'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Markup from './pages/Markup'
import Search from './pages/Search'
import logo from './img/logo.svg'
import './style.sass'
import { TextField, Typography, InputAdornment, Icon, IconButton } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import AuthBar from './components/AuthBar';


const pages = [
  { url: '/', title: 'О проекте', cmp: Home },
  { url: '/upload', title: 'Загрузить', cmp: Upload },
  { url: '/markup', title: 'Разметить', cmp: Markup },
  { url: '/search', title: 'Поиск', cmp: Search }
]

const TitleSetter = (props: { title: string }) => {
  document.title = props.title
  return null
}

const FastSearchForm = (props: { autofocus: boolean, onSearch: (q: string) => void }) => {
  const [ query, setQuery ] = React.useState('')
  const [ error, setError ] = React.useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim() === '') {
      setError(true)
    } else {
      props.onSearch(query)
      location.href = '#/search'
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField label='Поиск' value={query} autoFocus={props.autofocus}
        onChange={e => setQuery(e.target.value)} error={error}
        InputProps={{ endAdornment:
          <InputAdornment position='end'>
            <IconButton onClick={handleSubmit}><Icon>search</Icon></IconButton>
          </InputAdornment> }}
      />
    </form>
  )
}

const App = withRouter(props => {
  const [ searchQuery, search ] = React.useState('')
  return (
    <div>
      <Center className='header'>
        <div className='header-top'>
          <Link to='/' title='На главную'><img src={logo} className='logo' /></Link>
          {props.location.pathname !== '/search' &&
            <FastSearchForm
              autofocus={props.location.pathname === '/'}
              onSearch={q => search(q)} />
          }
          <div style={{ justifySelf: 'flex-end' }}>
            <AuthBar />
          </div>
        </div>
        <div className="header-bottom">
          {pages.filter(page => page.url !== '/search').map(page =>
            props.location.pathname === page.url ?
              <div className='header-link active'><Typography>{page.title}</Typography></div>
            :
              <Link className='header-link clickable' key={page.url} to={page.url}><Typography>{page.title}</Typography></Link>
          )}
        </div>
      </Center>
      {pages.map(page =>
        <Route path={page.url} key={page.url} exact>
          <TitleSetter title={page.title} />
          {page.url === '/search' ? <Search query={searchQuery} /> : <page.cmp />}
        </Route>
      )}
    </div>
  )
})

export default () => (
  <SnackbarProvider><Router><App /></Router></SnackbarProvider>
)