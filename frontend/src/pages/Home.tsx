import React from 'react'
import Center from '../layout/Center'
import { Link } from 'react-router-dom'
import { Typography, Card, CardContent, Dialog, DialogContent } from '@material-ui/core';
import BigFont from '../layout/BigFont';
import Subscription from '../components/Subscription'
import tactics from '../img/tactics.jpg'
import musk from '../img/musk.jpg'
import steve from '../img/steve.jpg'
import { AuthState } from '../util/Types'


const bright_link_color = '#5ff2ff'

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

const White = (props: any) => (
  <span style={{ color: 'white' }}>{props.children}</span>
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

const WhiteList = (props: React.PropsWithChildren<{}>) =>
  <ul style={{ marginTop: 20, color: 'white' }}>{props.children}</ul>

const yandex_money = 'https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D1%83%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&payment-type-choice=on&hint=&successURL=&quickpay=shop&account=4100112271118330'
const smeshariki = 'https://sun9-35.userapi.com/IuO4PcE7HUqo1XF7W3MlMHIXdRnP73c9LlbVtA/JhrH53AWHWI.jpg'
const google_form = 'https://forms.gle/vtsFXmXxnqeh245U6'

interface HomeProps {
  authState: AuthState
  onRegisterClick: () => void
}

interface HomeState {
  donateOpen: boolean
}

export default class Home extends React.Component<HomeProps, HomeState> {
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
        <Section style={backImg(musk)}>
          <BigFont>
            Часто бывает так, что вы тратите<br />
            на поиски нужного мема больше 30 секунд?< br />
            Или, что ещё хуже, так его и не находите?
          </BigFont>
        </Section>
        <Section>
          <div className='text-with-img'>
            <img src={smeshariki} />
            <div>
              <Typography variant='h4' className='news'>
                У нас для вас отличные новости!
              </Typography>
              <Typography>
                Мы создаём веб-приложение, позволяющее быстро и эффективно искать мемы
              </Typography>
            </div>
          </div>
        </Section>
        <Section style={backImg(steve)}>
          <Heading>
            Наши фичи:
          </Heading>
          <ul style={{ marginTop: 20 }}>
            <li>
              <Typography>
                <Link to='/upload' style={{ color: bright_link_color }}>Создание/перенос</Link> на наш сайт своей коллекции мемов, с возможностью добавить им описания,
                что существенно облегчит поиск по ней, а также синхронизирует её для всех ваших устройств.
              </Typography>
            </li>
            <li>
              <Typography>
                Возможность <Link to='/search' style={{ color: bright_link_color }}>поиска</Link> (в т.ч. по мемам всех пользователей, если нужный не нашелся среди ваших).
              </Typography>
            </li>
            <li>
              <Typography>
                Можно покекать с забавных случайных мемов в разделе <Link to='/random' style={{ color: bright_link_color }}>&laquo;Рандом&raquo;</Link>.
              </Typography>
            </li>
          </ul>
        </Section>
        <Section>
          <Heading>Инструкция по созданию своей базы мемов с быстрым доступом к ней:</Heading>
          <ul style={{ marginTop: 20 }}>
            <li>
              <Typography>
                {this.props.authState.status === "no" ?
                  <a href="#" onClick={e => {
                    e.preventDefault()
                    this.props.onRegisterClick()
                  }}>Зарегистрируйтесь</a>
                :
                  'Зарегистрируйтесь'
                } на нашем сайте.
              </Typography>
            </li>
            <li>
              <Typography><Link to='/upload'>Загрузите</Link> свои мемы</Typography>
            </li>
            <li>
              <Typography>Добавьте наш сайт в закладки (Ctrl + D), чтобы искать мемы ещё быстрее</Typography>
            </li>
          </ul>
        </Section>
        <Section style={backImg(tactics)}>
          <Heading>Наши планы на неделю (до 19 апреля)</Heading>
            <WhiteList>
              <li>
                <Typography>Возможность размечать и добавлять себе мемы из поиска.</Typography>
              </li>
              <li>
                <Typography>Авторазметка мемов при загрузке (уже реализовали, оптимизируем).</Typography>
              </li>
              <li>
                <Typography>Добавление списка тегов и возможности поиска по ним.</Typography>
              </li>
              <li>
                <Typography>Слияние всех одинаковых по картинке+тексту мемов в один (решение нашли, встраиваем).</Typography>
              </li>
              <li>
                <Typography>
                  Анализ всех предложений и замечаний, присланных&nbsp;
                  <a href={google_form} target='_blank' style={{ color: bright_link_color }}>сюда</a> (лучшие обязательно реализуем).
                  О багах, если таковые встретите, можно сообщить туда же.
                </Typography>
              </li>
            </WhiteList>
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
              <Link to='upload'>Закинуть</Link> нам пачку своих мемов
            </C>
            <C>
              <Link to='markup'>Разметить</Link> уже имеющиеся у нас мемы
            </C>
            <C>
              <a href='#' onClick={e => {
                e.preventDefault()
                this.setState({ donateOpen: true })
              }}>Задонатить</a> нам на индуса (скорость разработки &times;2)
            </C>
            <C>
              <a href={google_form} target='_blank'>Сообщить</a> нам любые свои идеи на этот счёт
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