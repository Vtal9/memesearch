import React from 'react'
import { Grid, Typography, Button, Chip } from '@material-ui/core'
import Axios from 'axios'


type Tag = {
  id: number
  tag: string
}

type ServerResponse = {
  arr: { tags: Tag[] }[]
}

function getTags(id: number) {
  return new Promise<Tag[]>((resolve, reject) => {
    Axios.get<ServerResponse>(`tags/api/tagged?id=${id}`).then(response => {
      resolve(response.data.arr[0].tags)
    }).catch(() => {
      reject()
    })
  })
}

type TagsFormState = {
  status:
  | { type: 'loading' | 'error' }
  | { type: 'done', tags: Tag[] }
}

type TagsFormProps = {
  id: number
}

class TagsForm extends React.Component<TagsFormProps, TagsFormState> {
  state: TagsFormState = {
    status: { type: 'loading' }
  }

  async load() {
    try {
      this.setState({
        status: { type: 'done', tags: await getTags(this.props.id) }
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
    // case 'done':
    //   return this.state.status.tags.map(item => (
    //     <Chip
    //   ))
    }
  }
}

export default TagsForm