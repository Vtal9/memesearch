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
import { SnackbarProvider, withSnackbar } from 'notistack'
import AuthBar from './components/auth/Bar';
import { AuthState } from './util/Types'
import AddTag from './pages/AddTag'
import MyMemes from './pages/MyMemes'
import Random from './pages/Random'
import QuickSearch from './components/QuickSearch'
import Path from './util/Path'
import { PageProps } from './pages/PageProps'


const TitleSetter = (props: { title: string }) => {
  document.title = props.title + '. MemeSearch'
  return null
}

export function toUrl(path: string) {
  const i = path.indexOf(':')
  const to = i == -1 ? path : path.substr(0, i) + '.'
  return to
}

const Tab = (props: { label: string, match: string, to: string }) => {
  const match = useRouteMatch({ path: props.match })

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

type Page = {
  match: string
  title: string
  cmp: React.ComponentClass<PageProps> | ((p: PageProps) => JSX.Element)
  location: 'header' | 'authbar' | 'no'
}

const rawPages: Page[] = [
  { match: Path.TINDER, title: 'Тиндер', cmp: Random, location: 'header' },
  { match: Path.FEED, title: 'Лента', cmp: Feed, location: 'header' },
  { match: Path.SEARCH, title: 'Поиск', cmp: Search, location: 'header' },
  { match: Path.UPLOAD, title: 'Загрузить', cmp: Upload, location: 'authbar' },
  { match: Path.MARKUP, title: 'Разметить', cmp: Markup, location: 'authbar' },
  { match: Path.HOME, title: 'О проекте', cmp: Home, location: 'no' },
  { match: '/newtag', title: 'Новый тег', cmp: AddTag, location: 'no' }, // TODO remove
  { match: Path.COLLECTION, title: 'Коллекция', cmp: MyMemes, location: 'authbar' },
]

export const pages = rawPages.map(item => {
  return {
    ...item,
    cmp: withSnackbar(withRouter(item.cmp)),
    url: toUrl(item.match)
  }
})

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
                {pages.filter(page => page.location === 'header').map(page =>
                  <Tab to={page.url} label={page.title} key={page.url} match={page.match} />
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
        <Route path={page.match} key={page.url}>
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