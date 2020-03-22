import React from 'react'
import Container from '@material-ui/core/Container'


export default (props: any) => (
  <Container maxWidth='md' {...props}>
    {props.children}
  </Container>
)