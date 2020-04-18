

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'

const AccountView = (props) => {

  return <div className="animated fadeIn">
    Account Page
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile
  }
}

export default connect(mapStateToProps)(AccountView)
