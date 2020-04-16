import React from 'react'
import { Grid, Typography, Button, Chip, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core'
import Axios from 'axios'


type Tag = {
  id: number
  tag: string
}

function getTags() {
  return new Promise<Tag[]>((resolve, reject) => {
    Axios.get<Tag[]>(`tags/api/all`).then(response => {
      resolve(response.data)
    }).catch(() => {
      reject()
    })
  })
}

type TagsFormState = {
  status:
  | { readonly type: 'loading' | 'error' }
  | { type: 'done', tags: Tag[] }
}

type TagsFormProps = {
  id: number
  onDone?: () => void
}

class TagsForm extends React.Component<TagsFormProps, TagsFormState> {
  state: TagsFormState = {
    status: { type: 'loading' }
  }

  async load() {
    this.setState({ status: { type: 'loading' } })
    try {
      this.setState({
        status: { type: 'done', tags: await getTags() }
      })
    } catch {
      this.setState({
        status: { type: 'error' }
      })
    }
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: TagsFormProps) {
    if (prevProps.id !== this.props.id) {
      this.load()
    }
  }

  render() {
    switch (this.state.status.type) {
    case 'loading':
      return <Typography color='textSecondary'>Загрузка тегов...</Typography>
    case 'error':
      return (
        <div className='vmiddle'>
          <Typography color='error'>Ошибка при загрузке тегов</Typography>
          <Button color='primary' onClick={() => this.load()}>Попробовать ещё раз</Button>
        </div>
      )
    case 'done':
      return (
        <TagSelector tags={this.state.status.tags} id={this.props.id}
          onDone={this.props.onDone} />
      )
    }
  }
}

export default TagsForm


function addTag(memeId: number, tagId: number) {
  return new Promise((resolve, reject) => {
    Axios.post(`api/addTag?tag=${tagId}&id=${memeId}`).then(() => {
      resolve()
    }).catch(() => reject())
  })
}

type TagSelectorProps = {
  tags: Tag[]
  id: number
  onDone?: () => void
}

type TagSelectorState = {
  selectedIndex: number | '',
  status: 'loading' | 'initial'
}

class TagSelector extends React.Component<TagSelectorProps, TagSelectorState> {
  state: TagSelectorState = {
    selectedIndex: '',
    status: 'initial'
  }

  async add() {
    if (this.state.selectedIndex === '') return
    this.setState({ status: 'loading' })
    try {
      await addTag(this.props.id, this.props.tags[this.state.selectedIndex].id)
      if (this.props.onDone) this.props.onDone()
    } catch {}
    this.setState({ status: 'initial' })
  }

  render() {
    const labelId = 'tags-label'
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <FormControl>
          <InputLabel id={labelId}>Выберите тег</InputLabel>
          <Select
            style={{ width: 150 }}
            value={this.state.selectedIndex}
            labelId={labelId}
            onChange={e => this.setState({selectedIndex: e.target.value as number})}
          >
            {this.props.tags.map((item, index) => (
              <MenuItem key={item.id} value={index}>{item.tag}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          disabled={this.state.status === 'loading' || this.state.selectedIndex === ''}
          color='primary'
          onClick={() => this.add()}
        >Добавить</Button>
      </div>
    )
  }
}