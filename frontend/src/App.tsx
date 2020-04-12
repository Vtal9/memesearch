import React, { FormEvent } from 'react'
import { HashRouter as Router, Route, Link, withRouter, Redirect } from 'react-router-dom'
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
import { AuthState } from './util/Types'


const Main = () => <Redirect to='/search' />

const TitleSetter = (props: { title: string }) => {
  document.title = props.title + '. MemeSearch'
  return null
}

const FastSearchForm = (props: { onSearch: (q: string) => void }) => {
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
      <TextField label='Поиск' value={query}
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
  const [ authBar, setAuthBar ] = React.useState<AuthBar | null>(null)
  const [ authState, setAuthState ] = React.useState<AuthState>({ status: 'unknown' })

  const pages = [
    { url: '/', title: 'Главная', cmp: <Main /> },
    { url: '/search', title: 'Поиск', cmp: <Search query={searchQuery} authState={authState} /> },
    { url: '/about', title: 'О проекте', cmp: <Home authState={authState} onRegisterClick={() => (authBar as AuthBar).openRegister()} /> },
    { url: '/upload', title: 'Загрузить', cmp: <Upload authState={authState} /> },
    { url: '/markup', title: 'Разметить', cmp: <Markup /> }
  ]

  return (
    <div>
      <Center className='header'>
        <div className='header-top'>
          <Link to='/search' title='На главную'><img src={logo} className='logo' /></Link>
          {props.location.pathname !== '/search' &&
            <FastSearchForm 
              onSearch={q => search(q)} />
          }
          <div style={{ justifySelf: 'flex-end' }}>
            <AuthBar authState={authState} ref={ref => setAuthBar(ref)} onAuthStateChange={u => {
              if (u === null) {
                setAuthState({ status: 'no' })
              } else {
                setAuthState({ status: 'yes', user: u })
              }
            }} />
          </div>
        </div>
        <div className="header-bottom">
          {pages.filter(page => page.url !== '/').map(page =>
            props.location.pathname === page.url ?
              <div className='header-link active' key={page.url}><Typography>{page.title}</Typography></div>
            :
              <Link className='header-link clickable' key={page.url} to={page.url}><Typography>{page.title}</Typography></Link>
          )}
        </div>
      </Center>
      {pages.map(page =>
        <Route path={page.url} key={page.url} exact>
          <TitleSetter title={page.title} />
          {page.cmp}
        </Route>
      )}
    </div>
  )
})

export default () => (
  <SnackbarProvider><Router><App /></Router></SnackbarProvider>
)