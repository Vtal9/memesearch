import React from 'react'
import Center from '../layout/Center'
import { Link } from 'react-router-dom'
import { Typography, Stepper, StepLabel, Step, StepContent, Card, CardContent, Dialog, DialogContent } from '@material-ui/core';
import BigFont from '../layout/BigFont';
import Subscription from '../components/Subscription'


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
    color: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const elon_musk = 'https://sun9-60.userapi.com/e64oM2-yQaamcYYE8thCFbaIxXMFTIZ8qplD7w/URdq_9euAd0.jpg'
const taktika = 'https://sun9-59.userapi.com/rm6ZVxuOQEQrh9k-hbgIz0vK1bnuEjWX09vSrQ/5HKjBmaRUR8.jpg'
const yandex_money = 'https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D1%83%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&payment-type-choice=on&hint=&successURL=&quickpay=shop&account=4100112271118330'
const smeshariki = 'https://sun9-35.userapi.com/IuO4PcE7HUqo1XF7W3MlMHIXdRnP73c9LlbVtA/JhrH53AWHWI.jpg'
const google_form = 'https://docs.google.com/forms/d/1d0NYKmlJcAL5mG6UgFGh0BMxUdiK60Tue3Gzla2_oG8'

export default () => {
  const [ donateOpen, setDonateOpen ] = React.useState(false)
  return (
    <div>
      <Dialog open={donateOpen} onClose={_ => setDonateOpen(false)}>
        <DialogContent>
          <iframe src={yandex_money} width="422" height="222" allowTransparency={true} scrolling="no" frameBorder={0} />
        </DialogContent>
      </Dialog>
      <Section style={backImg(elon_musk)}>
        <BigFont>
          Часто бывает такое: вы помните,<br />
          что есть <i>восхитительный мем</i>,<br />
          <b>идеально</b> вписывающийся в возникшую ситуацию,<br />
          но просто нагуглить его не получается?
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
          <Typography>
            Мы создаём веб-приложение, позволяющие эффективно искать мемы по их примерному описанию.<br />
            Вдохновившись расширенным поиском фильмов на Кинопоиске, мы решили запилить нечто похожее и для мемов.
          </Typography>
        </div>
      </Section>
      <Section style={backImg(taktika)}>
        <Heading>Есть ли у нас какой-то план,<br />и придерживаемся ли мы его?<br />&nbsp;</Heading>
        <Typography paragraph variant='h5'>Да, у нас есть какой-то план, и мы его придерживаемся:</Typography>
        <Stepper orientation='vertical' activeStep={-1} style={{
          background: 'transparent',
          color: 'white'
        }}>
          <Step expanded>
            <StepLabel><White><b>Pre-alpha</b> (сейчас)</White></StepLabel>
            <StepContent>
              <Typography>
                Собираем базы данных размеченных и неразмеченных мемов.
              </Typography>
            </StepContent>
          </Step>
          <Step expanded>
            <StepLabel><White><b>Alpha</b> (после накопления 10-20к размеченных мемов)</White></StepLabel>
            <StepContent>
              <Typography>
                Запускаем поисковик по размеченным мемам.
                Поиск на данном этапе будет только по примерному тексту мема и описанию картинки.
              </Typography>
            </StepContent>
          </Step>
          <Step expanded>
            <StepLabel><White><b>Beta</b> (после накопления 60-120к размеченных мемов)</White></StepLabel>
            <StepContent>
              <Typography>
                Тренируем нашу замечательную нейросетку, далее свежайшие мемы будут добавляться и размечаться автоматически.
                К критериям поиска добавляется ряд флагов и настраиваемых параметров.
              </Typography>
            </StepContent>
          </Step>
          <Step expanded>
            <StepLabel><White><b>Прекрасная Россия будущего</b></White></StepLabel>
            <StepContent>
              <Typography>
                Любой существующий мем ищется за пару кликов и несколько напечатанных слов.
              </Typography>
            </StepContent>
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
            Также вы можете подписаться на рассылку,
            чтобы мы сообщали вам о всех важных событиях и крупных обновлениях:
          </Typography>
          <Subscription />
        </div>
      </Section>
    </div>
  )
}