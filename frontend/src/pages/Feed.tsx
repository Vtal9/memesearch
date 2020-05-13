import React from 'react'
import Gallery from '../components/gallery/Gallery'
import { Tag, InvisibleMeme } from '../util/Types'
import { Select, MenuItem, FormControl, FormLabel, Paper } from '@material-ui/core'
import Center from '../layout/Center'
import BigFont from '../layout/BigFont'
import { feedApi } from '../api/MemesGetters'
import TagsPicker from '../components/inputs/TagsPicker'
import { PageProps } from './PageProps'


type Filter = "rating" | "time" | "ratio"

type FeedState = {
  status:
  | { type: 'loading' }
  | { type: 'done' }
  list: InvisibleMeme[]
  filter: Filter
  plusTags: Tag[]
  minusTags: Tag[]
}

// TODO: make this beatiful: remove excess buttons, add likes and dislikes number etc
export default class Feed extends React.Component<PageProps, FeedState> {
  constructor(props: PageProps) {
    super(props)
    this.state = {
      filter: 'rating',
      plusTags: [],
      minusTags: [],
      status: { type: 'loading' },
      list: []
    }
  }

  replace: boolean = false
  pagesLoaded = 0

  scrollListener = () => {
    const eps = 2
    if (window.innerHeight + window.scrollY + eps >= document.body.offsetHeight) {
      console.log('bottom')
      this.replace = false
      this.load()
    }
  }

  componentDidMount() {
    this.load()
    window.onscroll = this.scrollListener
  }

  componentWillUnmount() {
    window.onscroll = null
  }

  async load() {
    this.setState({ status: { type: 'loading' } })
    const addition: InvisibleMeme[] = (await feedApi(
      this.state.filter,
      this.state.plusTags.map(tag => tag.id),
      this.state.minusTags.map(tag => tag.id),
      this.pagesLoaded
    ))
    let list: InvisibleMeme[] = []
    if (this.replace) {
      list = addition
    } else {
      list = [...this.state.list, ...addition]
    }
    this.setState({
      status: { type: 'done' }, list
    })
    this.pagesLoaded++
  }

  render() {
    return (
      <Center>
        <div className='spacing'></div>
        <Paper className='feed-controls'>
          <FormControl className='control'>
            <FormLabel>Сортировка</FormLabel>
            <Select
              style={{ marginTop: 8 }}
              value={this.state.filter}
              onChange={e => {
                this.pagesLoaded = 0
                this.replace = true
                this.setState({ filter: e.target.value as Filter }, this.load)
              }}
            >
              <MenuItem value='rating'>По рейтингу</MenuItem>
              <MenuItem value='time'>По времени</MenuItem>
              <MenuItem value='ratio'>По соотношению лайки / дизлайки</MenuItem>
            </Select>
          </FormControl>
          <FormControl className='control'>
          <FormLabel>Показывать только с тегами:</FormLabel>
            <div className="small-spacing" />
            <TagsPicker
              tags={this.state.plusTags}
              onChange={plusTags => {
                this.pagesLoaded = 0
                this.replace = true
                this.setState({ plusTags }, this.load)}
              }
            >Выбрать</TagsPicker>
          </FormControl>
          <FormControl className='control'>
            <FormLabel>Исключить из выдачи теги:</FormLabel>
            <div className="small-spacing" />
            <TagsPicker
              tags={this.state.minusTags}
              onChange={minusTags => {
                this.pagesLoaded = 0
                this.replace = true
                this.setState({ minusTags }, this.load)}
              }
            >Выбрать</TagsPicker>
          </FormControl>
        </Paper>
        {this.state.status.type === 'done' &&
          <div>
            {this.state.list.length === 0 &&
              <div>
                <div className="spacing" />
                <BigFont>Мемы кончились... :c</BigFont>
              </div>
            }
          </div>
        }
        <Gallery list={this.state.list} authState={this.props.authState} />
      </Center>
    )
  }
}