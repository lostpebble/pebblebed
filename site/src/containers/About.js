import React from 'react'
import { getRouteProps } from 'react-static'

export default getRouteProps(({ markdown }) => (
  <div dangerouslySetInnerHTML={{ __html: markdown }} />
))
