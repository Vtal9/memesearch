import React from 'react'
import Center from '../layout/Center'
import { Link } from 'react-router-dom'
import { Typography, Stepper, StepLabel, Step, StepContent, Card, CardContent, Dialog, DialogContent } from '@material-ui/core';
import BigFont from '../layout/BigFont';
import Subscription from '../components/Subscription'
import tactics from '../img/tactics.jpg'
import musk from '../img/musk.jpg'


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

const yandex_money = 'https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D1%83%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&payment-type-choice=on&hint=&successURL=&quickpay=shop&account=4100112271118330'
const smeshariki = 'https://sun9-35.userapi.com/IuO4PcE7HUqo1XF7W3MlMHIXdRnP73c9LlbVtA/JhrH53AWHWI.jpg'
const google_form = 'https://forms.gle/vtsFXmXxnqeh245U6'

export default () => {
  const [ donateOpen, setDonateOpen ] = React.useState(false)
  return (
    <div>
      <Dialog open={donateOpen} onClose={_ => setDonateOpen(false)}>
        <DialogContent>
          <iframe src={yandex_money} width="422" height="222" allowTransparency={true} scrolling="no" frameBorder={0} />
        </DialogContent>
      </Dialog>
      <Section style={backImg(musk)}>
        <BigFont>
          Часто бывает так, что вы тратите<br />
          на поиски нужного мема больше 30 секунд?<br />
          Или, что ещё хуже, так его и не находите?
        </BigFont>
      </Section>
      <Section style={{
        background: 'white'
      }}>
        <Heading>У нас для вас отличные новости!</Heading>
      </Section>
      <Section>
        <div className='text-with-img'>
          <img src={smeshariki} />
          <BigFont>
            Мы создаём веб-приложение, позволяющее быстро и эффективно искать мемы
          </BigFont>
        </div>
      </Section>
      <Section style={backImg(tactics)}>
        <White>
          <ul>
            <li>Создание/перенос на наш сайт своей коллекции мемов,
              которую мы автоматически разметим, что в разы облегчит поиск по ней,
              а также синхронизирует её для всех ваших устройств.</li>
            <li>Возможность поиска по всем имеющимся у нас мемам,
              если нужный не нашелся среди ваших (найденный мем можно сразу же добавить в свою коллекцию).</li>
            <li>Расширенный поиск, который за счёт большей кастомизации позволит
              куда лучше искать мемы (число настраиваемых параметров будет расти).</li>
            <li>Можно покекать с забавных случайных мемов, нажимая следующий мем в разделе разметки.</li>
          </ul>
        </White>
        <Typography paragraph variant='h5'>Инструкция по созданию своей базы мемов с быстрым доступом к ней:</Typography>
        <Stepper orientation='vertical' activeStep={-1} style={{
          background: 'transparent',
          color: 'white'
        }}>
          <Step expanded>
            <StepLabel>
              <Typography>
                <White><a onClick={} href='#'>Зарегистрируйтесь</a> на нашем сайте.</White></Typography></StepLabel>
          </Step>
          <Step expanded>
            <StepLabel><Typography><White>Загрузите свои мемы (лучше подредактировать авторазметку).</White></Typography></StepLabel>
          </Step>
          <Step expanded>
            <StepLabel><Typography><White>Добавьте наш сайт в закладки, чтобы искать мемы ещё быстрее.</White></Typography></StepLabel>
          </Step>
          <Step expanded>
            <StepLabel><Typography><White>Поздравляем, вы великолепны!</White></Typography></StepLabel>
          </Step>
        </Stepper>
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
            <Link to='markup'>Разметить</Link> имеющиеся у нас мемы
          </C>
          <C>
            <a href='#' onClick={e => {
              e.preventDefault()
              setDonateOpen(true)
            }}>Задонатить</a> нам на индуса, который будет размечать мемы за вас
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
            Если хотите первыми получать доступ ко всем крупным обновлениям и новым фичам,
            можете записаться в команду тестировки
            (вскоре мы скинем вам ссылочку на закрытую для остальных раннюю версию поисковика):
          </Typography>
          <Subscription />
        </div>
      </Section>
    </div>
  )
}