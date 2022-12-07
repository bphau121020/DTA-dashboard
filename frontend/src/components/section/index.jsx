import React from 'react'
import { Fade } from 'react-reveal'

const Section = (props) => {
  const { title } = props
  return (
    <section className={title.toLowerCase()}>
      <Fade left duration={1000} distance="70px">
        <h1 className="section-title">{title}</h1>
      </Fade>
      <Fade right duration={1000}>
        <div className="underline"></div>
      </Fade>
      {props.children}
    </section>
  )
}

export default Section
