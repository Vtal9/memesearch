import React from 'react'
import Gallery from '../components/gallery/Gallery'
import { UnloadedMeme, AuthState, Tag } from '../util/Types'
import { CircularProgress, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import Center from '../layout/Center'
import BigFont from '../layout/BigFont'
import { memesFeedApi } from '../api/MemesFeed'
import TagsPicker from '../components/TagsPicker';


type Filter = "rating" | "time" | "ratio"

type MyMemesProps = {
  authState: AuthState
}

type FeedState = {
  status:
  | { type: 'loading' }
  | { type: 'done' }
  list: UnloadedMeme[]
  filter: Filter
  tags: Tag[]
}

// TODO: make this beatiful: remove excess buttons, add likes and dislikes number etc
export default class Feed extends React.Component<MyMemesProps, FeedState> {
  constructor(props: MyMemesProps) {
    super(props)
    this.state = {
      filter: 'rating',
      tags: [],
      status: { type: 'loading' },
      list: []
    }
  }

  replace: boolean = false
  pagesLoaded = 0

  componentDidMount() {
    this.load()
    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.replace = false
        this.pagesLoaded++
        this.load()
      }
    };
  }

  async load() {
    this.setState({ status: { type: 'loading' } })
    const addition:UnloadedMeme[] = (await memesFeedApi(
      this.state.filter, this.state.tags.map(tag => tag.id) , this.pagesLoaded
      )).map( // dummy request
      // FeedMeme (with likes dislikes) -> UnloadedMeme (since Gallery is written for these)
      (meme) => ({
        type: 'native',
        id: meme.id, 
        url: meme.url
      })
    )
    let list:UnloadedMeme[] = []
    if (this.replace) {
      list = addition
    } else {
      list = [...this.state.list, ...addition]
    }
    this.setState({
      status: { type: 'done' }, list
    })
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
            <FormControlLabel value="rating" control={<Radio />} label="По рейтингу" />
            <FormControlLabel value="time" control={<Radio />} label="По времени" />
            <FormControlLabel value="ratio" control={<Radio />} label="По соотношению лайков и дизлайков" />
          </RadioGroup>
        </div>
        <div>
          <TagsPicker
            tags={this.state.tags}
            onChange={tags => {
              this.pagesLoaded = 0
              this.replace = true
              this.setState({ tags }, this.load)}
            }
          />
        </div>
        {this.state.status.type === 'done' &&
          <div>
            {this.state.list.length === 0 ?
              <BigFont>Мемы кончились... :c</BigFont>
            :
              <BigFont>Свежие мемы</BigFont>
            }
          </div>
        }
        <Gallery list={this.state.list} authState={this.props.authState} />
      </Center>
    )
  }
}