import React from 'react'
import { Typography } from '@material-ui/core'


export default (props: React.PropsWithChildren<{}>) => (
  <Typography variant='h5' style={{
    lineHeight: 1.5,
    fontWeight: 100
  }}>
    {props.children}
  </Typography>
)