import React from 'react'
import Gallery from '../components/gallery/Gallery'
import { AuthState, Tag, PureMeme } from '../util/Types'
import { RadioGroup, FormControlLabel, Radio, Icon } from '@material-ui/core'
import Center from '../layout/Center'
import BigFont from '../layout/BigFont'
import { memesFeedApi } from '../api/MemesFeed'
import TagsPicker from '../components/TagsPicker'
import TagsFilter from '../components/TagsFilter'


type Filter = "rating" | "time" | "ratio"

type MyMemesProps = {
  authState: AuthState
}

type FeedState = {
  status:
  | { type: 'loading' }
  | { type: 'done' }
  list: PureMeme[]
  filter: Filter
  plusTags: Tag[]
  minusTags: Tag[]
}

// TODO: make this beatiful: remove excess buttons, add likes and dislikes number etc
export default class Feed extends React.Component<MyMemesProps, FeedState> {
  constructor(props: MyMemesProps) {
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
    const addition: PureMeme[] = (await memesFeedApi(
      this.state.filter,
      this.state.plusTags.map(tag => tag.id),
      this.state.minusTags.map(tag => tag.id),
      this.pagesLoaded
    ))
    let list: PureMeme[] = []
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
        <div>
          <RadioGroup
            style={{ flexDirection: 'row' }}
            value={this.state.filter}
            onChange={e => {
              this.pagesLoaded = 0
              this.replace = true
              this.setState({ filter: e.target.value as Filter }, this.load)
            }}
          >
            <FormControlLabel value="rating" control={
              <Radio color='primary' />
            } label="По рейтингу" />
            <FormControlLabel value="time" control={
              <Radio color='primary' />
            } label="По времени" />
            <FormControlLabel value="ratio" control={
              <Radio color='primary' />
            } label="По отношению лайки / дизлайки" />
          </RadioGroup>
        </div>
        <div style={{ display: 'flex' }}>
          <div>
            <TagsPicker
              tags={this.state.plusTags}
              onChange={plusTags => {
                this.pagesLoaded = 0
                this.replace = true
                this.setState({ plusTags }, this.load)}
              }
            ><Icon fontSize='small'>add</Icon>Тег</TagsPicker>
          </div>
          <div style={{ marginLeft: 20 }}>
            <TagsPicker
              tags={this.state.minusTags}
              onChange={minusTags => {
                this.pagesLoaded = 0
                this.replace = true
                this.setState({ minusTags }, this.load)}
              }
            ><Icon fontSize='small'>remove</Icon>Тег</TagsPicker>
          </div>
        </div>
        {this.state.status.type === 'done' &&
          <div>
            {this.state.list.length === 0 &&
              <BigFont>Мемы кончились... :c</BigFont>
            }
          </div>
        }
        <Gallery list={this.state.list} authState={this.props.authState} />
      </Center>
    )
  }
}