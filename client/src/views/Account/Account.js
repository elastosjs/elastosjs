

import React, { useState, useEffect, useCallback, useMemo } from 'react'

import {
  Card, CardHeader, CardBody, Col, Row, ListGroup, ListGroupItem, CardFooter
} from 'reactstrap'

import { connect } from 'react-redux'

const AccountView = (props) => {

  return <div className="animated fadeIn container-fluid">
    <Card>
      <CardHeader>
        Your Account
      </CardHeader>
      <CardBody>

        <h3 className="text-dark">
          Welcome to elajs - this page is still <strong>Under Development</strong>
        </h3>

        <ListGroup className="mt-5">
          <ListGroupItem>
            Username: {props.profile.username}
          </ListGroupItem>
        </ListGroup>

      </CardBody>
      <CardFooter>
        <button className="btn btn-primary pull-right">Save Changes</button>
      </CardFooter>
    </Card>
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile
  }
}

export default connect(mapStateToProps)(AccountView)
