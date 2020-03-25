import React from 'react'
import { HashRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import Center from './layout/Center'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Markup from './pages/Markup'
import logo from './img/logo.svg'
import './style.sass'
import { Tabs, Tab } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'


const TitleWrapper = (props: {title: string, cmp: JSX.Element}) => {
  document.title = 'MemeSearch: ' + props.title
  return props.cmp
}

const pages = [
  { url: '/', title: 'Главная', cmp: <Home /> },
  { url: '/upload', title: 'Загрузить', cmp: <Upload /> },
  { url: '/markup', title: 'Разметить', cmp: <Markup /> }
].map(page => {
  page.cmp = <TitleWrapper title={page.title} cmp={page.cmp} />
  return page
})


const App = withRouter(props => (
  <div>
    <Center className='header'>
      <Link to='/' title='На главную'><img src={logo} className='logo' /></Link>
      <Tabs indicatorColor="primary" textColor="primary"
        value={props.location.pathname} onChange={(_: any, url: string) => location.href = '#' + url}
      >
        {pages.map(page =>
          <Tab key={page.url} value={page.url} label={page.title} />
        )}
      </Tabs>
    </Center>
    {pages.map(page =>
      <Route path={page.url} key={page.url} exact>
        {page.cmp}
      </Route>
    )}
  </div>
))

export default () => (
  <SnackbarProvider><Router><App /></Router></SnackbarProvider>
)