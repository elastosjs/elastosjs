import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '1' })}
                     onClick={() => {
                       this.toggle('1');
                     }}>
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>
          {/*
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '2' })}
                     onClick={() => {
                       this.toggle('2');
                     }}>
              <i className="icon-speech"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '3' })}
                     onClick={() => {
                       this.toggle('3');
                     }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
          */}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <ListGroup className="list-group-accent" tag={'div'}>
              <ListGroupItem className="list-group-item-accent-primary bg-light text-center font-weight-bold text-muted text-uppercase">Transactions</ListGroupItem>
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Today</ListGroupItem>
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-success list-group-item-divider text-center">
                <strong>Transactions Log</strong>
                <br/>
                <small className="text-muted">Coming Soon</small>
              </ListGroupItem>
              {/*
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-success list-group-item-divider">
                <div>Transaction - <strong>insertVal()</strong> </div>
                <small className="text-muted mr-3">
                  <i className="icon-calendar"></i>&nbsp; 11:20am PST
                </small>
                <small className="text-muted mr-3">
                  <i className="icon-layers"></i> <strong>MyDb</strong>
                </small>
                <br/>
                <small className="text-muted">
                  <i className="icon-list"></i> <strong>Table</strong>
                </small>
              </ListGroupItem>
              */}
            </ListGroup>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;
