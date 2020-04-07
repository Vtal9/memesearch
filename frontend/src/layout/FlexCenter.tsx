import React from 'react'


export default (props: React.PropsWithChildren<{}>) =>
  <div style={{ display: 'flex', justifyContent: 'center' }}>{props.children}</div>