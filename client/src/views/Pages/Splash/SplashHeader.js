import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const SplashHeader = (props) => {

  return (
    <Wrapper>
      <ElastosLogo src="/assets/img/Elastos_Icon_RGB.png"/>
      <Button to="/login">
        <button className="btn btn-primary" href="getting-started/intro.html">Login / Sign-Up</button>
      </Button>
      <BlankButton href="https://docs.elastosjs.com">
        <button className="btn btn-link">
          Documentation
        </button>
      </BlankButton>
    </Wrapper>
  )

}

const ElastosLogo = styled.img`
  height: 50px;
  position: absolute;
  left: 0;
  top: 2px;
  padding: 8px;
`

const Wrapper = styled.div`
  width: 100%;
  height: 55px;
  background-color: #fff;
  border-bottom: 1px solid rgb(200, 206, 211);
  display: flex;
  flex-direction: row-reverse;
  justify-content: right;

  padding: 0 2%;
`

const Button = styled(Link)`
  display: block;
  padding: 0 12px;
  
  > button {
    font-family: 'Bio sans';
    text-transform: uppercase;
    margin: 10px 0;
    border-radius: 4px;
    background-color: #0b687c;
    color: #fff;
  }
`

const BlankButton = styled.a`

  display: block;
  margin: 15px 0;

  > button {
    color: #1c2f4a;
    font-family: 'Bio sans';
    text-transform: uppercase;
    padding: 0 18px;
  
    &:hover {
      text-decoration: none;
    }
  }
`

export default SplashHeader
