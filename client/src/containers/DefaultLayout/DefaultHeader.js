import React, { useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { toastr } from 'react-redux-toastr'

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/elastosJS.svg'
import logoSmall from '../../assets/img/brand/elastosJS.svg'

const DefaultHeader = (props) => {

  const handleChangeNet = useCallback(() => {
    toastr.info('Coming Soon')
  })

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand
        full={{ src: logo, width: 89, height: 25, alt: 'ElastosJS Logo' }}
        minimized={{ src: logoSmall, width: 30, height: 30, alt: 'ElastosJS Logo' }}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />

      <Nav className="d-md-down-none" navbar>
        {/*
        <NavItem className="px-3">
          <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/users" className="nav-link">Users</Link>
        </NavItem>
        <NavItem className="px-3">
          <NavLink to="#" className="nav-link">Settings</NavLink>
        </NavItem>
        */}
      </Nav>
      <Nav className="ml-auto" navbar>

        <NavItem className="d-md-down-none mr-4">
          <a target="_blank" href="https://docs.elastosjs.com" className="text-muted">Documentation</a>
        </NavItem>
        {/*
        <NavItem className="d-md-down-none">
          <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
        </NavItem>
        <NavItem className="d-md-down-none">
          <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
        </NavItem>
        */}
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav>
            Testnet <i className="cui-chevron-bottom icons"/>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>TestNet</DropdownItem>
            <DropdownItem onClick={() => handleChangeNet('mainnet')}>MainNet</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav>
            <i className="fa fa-user-circle-o fa-lg"/>
          </DropdownToggle>
          <DropdownMenu right>
            {/*
            <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
            <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
            <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
            <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
            <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
            <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
            <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
            <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
            <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
            <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
            <DropdownItem divider />
            <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
            */}
            <DropdownItem onClick={() => window.location.hash = 'account'}><i className="fa fa-user"></i> Account</DropdownItem>
            <DropdownItem onClick={e => props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
      <AppAsideToggler className="d-md-down-none" />
      {/*<AppAsideToggler className="d-lg-none" mobile />*/}
    </React.Fragment>
  );

}

export default DefaultHeader;
