import React from 'react'
import Center from '../layout/Center'
import { Link } from 'react-router-dom'
import { Typography } from '@material-ui/core';
import Subscription from '../components/Subscription'
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

const musk = 'https://sun9-46.userapi.com/c853524/v853524127/233bc0/ThRnsRxbv9k.jpg'

export default class Home extends React.Component<PageProps> {
  render() {
    return (
      <div>
        <div className='spacing' />
        <Section>
          <Heading>Инструкция по созданию своей базы мемов:</Heading>
          <ul style={{ marginTop: 20 }}>
            <li>
              <Typography>Зарегистрируйтесь на нашем сайте</Typography>
            </li>
            <li>
              <Typography>
                Орите с мемов в <Link to={Path.TINDER}>Тиндере</Link>
                &nbsp;и <Link to={Path.FEED}>Ленте</Link>, попутно добавляя их в свою коллекцию
              </Typography>
            </li>
            <li>
              <Typography>Также вы можете загрузить и свои мемы</Typography>
            </li>
            <li>
              <Typography>
                <Link to={Path.SEARCH}>Ищите</Link> мемы по своей коллекции или, если не нашли у себя,
                по объединенной коллекции всех пользователей
              </Typography>
            </li>
          </ul>
        </Section>
        <Section style={{ textAlign: 'center' }}>
          <img src={musk} style={{ width: '100%' }} />
        </Section>
        <Section>
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