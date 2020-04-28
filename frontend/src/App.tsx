import React from 'react'
import { HashRouter as Router, Route, Link, withRouter, Redirect, useRouteMatch } from 'react-router-dom'
import Center from './layout/Center'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Markup from './pages/Markup'
import Search from './pages/Search'
import logo from './img/logo.svg'
import './style.sass'
import { Typography } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import AuthBar from './components/AuthBar';
import { AuthState } from './util/Types'
import AddTag from './pages/AddTag'
import MyMemes from './pages/MyMemes'
import Random from './pages/Random'
import QuickSearch from './components/QuickSearch'
import Path from './util/Path'


const TitleSetter = (props: { title: string }) => {
  document.title = props.title + '. MemeSearch'
  return null
}

const Tab = (props: { label: string, to: string }) => {
  const match = useRouteMatch({ path: props.to })
  return match ? (
    <div className='header-link active'>
      <Typography>{props.label}</Typography>
    </div>
  ) : (
    <Link className='header-link clickable' to={props.to}>
      <Typography>{props.label}</Typography>
    </Link>
  )
}

const App = withRouter(props => {
  const [ searchQuery, search ] = React.useState('')
  const [ authBar, setAuthBar ] = React.useState<AuthBar | null>(null)
  const [ authState, setAuthState ] = React.useState<AuthState>({ status: 'unknown' })

  const pages = [
    { url: Path.SEARCH, title: 'Поиск', cmp: <Search query={searchQuery} authState={authState} />, tab: true },
    { url: Path.HOME, title: 'О проекте', cmp: <Home authState={authState} onRegisterClick={() => (authBar as AuthBar).openRegister()} />, tab: true },
    { url: Path.UPLOAD, title: 'Загрузить', cmp: <Upload authState={authState} />, tab: true },
    { url: Path.MARKUP, title: 'Разметить', cmp: <Markup />, tab: true },
    { url: '/newtag', title: 'Новый тег', cmp: <AddTag />, tab: false }, // TODO remove
    { url: Path.COLLECTION, title: 'Коллекция', cmp: <MyMemes authState={authState} />, tab: false },
    { url: Path.TINDER, title: 'Тиндер', cmp: <Random authState={authState} />, tab: true }
  ]

  const displaySearch = !useRouteMatch({ path: Path.SEARCH })

  return (
    <div>
      <Route path='/' exact><Redirect to={Path.SEARCH} /></Route>

      <Center className='header'>
        <div className='header-top'>
          <Link to={Path.HOME} title='На главную'>
            <img src={logo} className='logo' />
          </Link>
          {displaySearch &&
            <QuickSearch onSearch={q => search(q)} />
          }
          <AuthBar
            authState={authState}
            ref={ref => setAuthBar(ref)}
            onAuthStateChange={newAuthState => setAuthState(newAuthState)}
          />
        </div>
        <div className="header-bottom">
          {pages.filter(page => page.tab).map(page =>
            <Tab to={page.url} label={page.title} key={page.url} />
          )}
        </div>
      </Center>
      {pages.map(page =>
        <Route path={page.url} key={page.url}>
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