import React from 'react'
import Center from '../layout/Center'
import { Link } from 'react-router-dom'
import { Typography, Card, CardContent, Dialog, DialogContent } from '@material-ui/core';
import Subscription from '../components/Subscription'
import steve from '../img/steve.jpg'
import Path from '../util/Path'
import { PageProps } from './PageProps';

const Heading = (props: React.PropsWithChildren<{}>) => (
  <Typography variant='h4' align='center' style={{ fontWeight: 100 }}>
    {props.children}
  </Typography>
)

const Section = (props: any) => (
  <div {...props}>
    <div className='section'>
      <Center>
        {props.children}
      </Center>
    </div>
  </div>
)

const C = (props: any) => (
  <Card style={{
    flex: 1,
    margin: '20px 10px 0',
    minWidth: 200
  }}>
    <CardContent>
      <Typography align='center'>{props.children}</Typography>
    </CardContent>
  </Card>
)

function backImg(url: string) {
  return {
    backgroundImage: `url(${url})`,
    backgroundColor: '#545976',
    color: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const yandex_money = 'https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D1%83%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&payment-type-choice=on&hint=&successURL=&quickpay=shop&account=4100112271118330'
const google_form = 'https://forms.gle/vtsFXmXxnqeh245U6'

type State = {
  donateOpen: boolean
}

export default class Home extends React.Component<PageProps, State> {
  state = {
    donateOpen: false
  }

  render() {
    return (
      <div>
        <Dialog open={this.state.donateOpen} onClose={_ => this.setState({ donateOpen: false })}>
          <DialogContent>
            <iframe src={yandex_money} width="422" height="222" allowTransparency={true} scrolling="no" frameBorder={0} />
          </DialogContent>
        </Dialog>
        <Section style={backImg(steve)} className='dark'>
          <Heading>Инструкция по созданию своей базы мемов с быстрым доступом к ней:</Heading>
          <ul style={{ marginTop: 20 }}>
            <li>
              <Typography>
                {this.props.authState.status === "no" ?
                  <a href="#" onClick={e => {
                    e.preventDefault()
                    //this.props.onRegisterClick() TODO
                  }}>Зарегистрируйтесь</a>
                :
                  'Зарегистрируйтесь'
                } на нашем сайте.
              </Typography>
            </li>
            <li>
              <Typography><Link to={Path.UPLOAD}>Загрузите</Link> свои мемы</Typography>
            </li>
            <li>
              <Typography>
                Орите с мемов в <Link to={Path.TINDER}>&laquo;Тиндере&raquo;</Link>
                &nbsp;и <Link to={Path.FEED}>Ленте</Link>, попутно добавляя их в свою коллекцию
              </Typography>
            </li>
            <li>
              <Typography>
                <Link to={Path.SEARCH}>Ищите</Link> мемы по своей коллекции или, если не нашли у себя,
                по объединенной коллекции всех пользователей
              </Typography>
            </li>
          </ul>
        </Section>
        <Section>
          <Heading>Чем вы можете нам помочь?</Heading>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            margin: '0 -10px 20px'
          }}>
            <C>
              <a href='#' onClick={e => {
                e.preventDefault()
                this.setState({ donateOpen: true })
              }}>Задонатить</a> нам на индуса (скорость разработки &times;2)
            </C>
            <C>
              <a href={google_form} target='_blank'>Написать</a> нам любые замечания и предложения
            </C>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography>
              Если вы хотите первыми получать доступ ко всем крупным обновлениям и новым фичам, можете записаться в команду тестирования:
            </Typography>
            <Subscription />
          </div>
        </Section>
      </div>
    )
  }
}