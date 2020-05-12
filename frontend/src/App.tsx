import React from 'react'
import { HashRouter as Router, Route, Link, withRouter, Redirect, useRouteMatch, Switch } from 'react-router-dom'
import Center from './layout/Center'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Markup from './pages/Markup'
import Search from './pages/Search'
import Feed from './pages/Feed'
import logo from './img/logo.svg'
import './style.sass'
import { Typography } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import AuthBar from './components/auth/Bar';
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
  const i = props.to.indexOf(':')
  const to = i == -1 ? props.to : props.to.substr(0, i) + '.'
  const match = useRouteMatch({ path: to })

  return match ? (
    <div className='header-link active'>
      <Typography>{props.label}</Typography>
    </div>
  ) : (
    <Link className='header-link clickable' to={to}>
      <Typography>{props.label}</Typography>
    </Link>
  )
}

const pages = [
  { url: Path.TINDER, title: 'Тиндер', cmp: Random, tab: true },
  { url: Path.FEED, title: 'Лента', cmp: Feed, tab: true },
  { url: Path.SEARCH, title: 'Поиск', cmp: Search, tab: true },
  { url: Path.UPLOAD, title: 'Загрузить', cmp: Upload, tab: false },
  { url: Path.MARKUP, title: 'Разметить', cmp: Markup, tab: false },
  { url: Path.HOME, title: 'О проекте', cmp: Home, tab: false },
  { url: '/newtag', title: 'Новый тег', cmp: AddTag, tab: false }, // TODO remove
  { url: Path.COLLECTION, title: 'Коллекция', cmp: MyMemes, tab: false },
]

const App = withRouter(props => {
  const [ searchQuery, search ] = React.useState('')
  const [ authBar, setAuthBar ] = React.useState<AuthBar | null>(null)
  const [ authState, setAuthState ] = React.useState<AuthState>({ status: 'unknown' })

  const displaySearch = !useRouteMatch({ path: Path.SEARCH })

  return (
    <div>
      <Route path='/' exact><Redirect to={Path.SEARCH} /></Route>

      <div className='header'>
        <Center>
          <div className='blocks'>
            <div className='vmiddle'>
              <Link to={Path.HOME} title='На главную'>
                <img src={logo} className='logo' />
              </Link>
              <div className='quick-search-wrapper'>
                {displaySearch &&
                  <QuickSearch onSearch={q => search(q)} />
                }
              </div>
            </div>
            <div className='vmiddle'>
              <div className='header-links'>
                {pages.filter(page => page.tab).map(page =>
                  <Tab to={page.url} label={page.title} key={page.url} />
                )}
                <AuthBar
                  authState={authState}
                  ref={ref => setAuthBar(ref)}
                  onAuthStateChange={newAuthState => setAuthState(newAuthState)}
                />
              </div>
            </div>
          </div>
        </Center>
      </div>
      {pages.map(page => (
        <Route path={page.url} key={page.url}>
          <TitleSetter title={page.title} />
          <page.cmp authState={authState} />
        </Route>
      ))}
    </div>
  )
})

export default () => (
  <SnackbarProvider><Router><App /></Router></SnackbarProvider>
)