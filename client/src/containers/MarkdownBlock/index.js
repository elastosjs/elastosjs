
import React from 'react'
import { Remarkable } from 'remarkable'
import { Markup } from 'interweave'

const md = new Remarkable()

const MarkdownBlock = (props) => {

  return <Markup content={md.render(props.children)}/>
}

export default MarkdownBlock
