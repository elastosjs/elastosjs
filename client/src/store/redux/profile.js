import namehash from 'eth-ens-namehash'
import _ from 'lodash'
import drizzle, { fmWeb3 } from '../index'

// import { createTable, addAddressToTable } from "../../services/contract";
// import Box from '../../contracts/Box'

function bufferToBytes32(buffer) {
  const padding = new Buffer(32 - buffer.length);
  return Buffer.concat([padding, buffer])
}

/**
 * Redux - Profile for a Viewer
 *
 * viewer.<walletAddress>.twitchId
 * streamer.<walletAddress>.twitchId
 *
 * streamer.<walletAddress>.followers.<twitchId>
 *
 * streamer.<walletAddress>.videos.<videoId>
 *
 * video.<videoId>.viewer.<twitchId>.startTime
 * video.<videoId>.viewer.<twitchId>.endTime
 *
 * // payouts
 * streamer.<walletAddress>.payouts.<walletAddress>
 */
export const ProfileActionTypes = {
  SET_ETH_ADDRESS: 'SET_ETH_ADDRESS',
  LOGGING_IN: 'LOGGING_IN',
  READY: 'READY',
  LOGOUT: 'LOGOUT'
};

/*
*************************************************************************************
* Store Schema
*************************************************************************************
 */
const initialState = {
  ready: false,
  loading: true,
  ethAddress: null
}

/**
 * Final Register Call
 *
 * - usually we send the password to the back-end, add a salt and hash it, but in this
 *   scenario we don't have a backend.
 *
 * - Also we are saving the hash to a public smart contract, so the security is low anyway,
 *   in this scenario the real security lies in the Fortmatic account which is the gatekeeper
 *   between any paid actions
 */
export const ActionRegister = () => {
  return async function(dispatch, getState, { ozWeb3 }){

    const state = getState()

    const salt = state.root.profile.ethAddress

  }
}

// export const ActionSetEth

export const ActionCheckAccts = () => {
  return async function(dispatch, getState, { fmWeb3 }){

    const state = getState()

    /*
    // check if there is an account, just once
    if (state.drizzleStatus.initialized && !state.accounts[0]){
      const ethAddress = await web3.currentProvider.enable()

      dispatch({
        type: ProfileActionTypes.SET_ETH_ADDRESS,
        ethAddress: ethAddress
      })
    }
    */

    // we are always calling Fortmatic now
    if (state.root.profile.ethAddress === null){
      const ethAddress = await fmWeb3.currentProvider.enable()

      dispatch({
        type: ProfileActionTypes.SET_ETH_ADDRESS,
        ethAddress: ethAddress[0]
      })
    }

    dispatch({
      type: ProfileActionTypes.READY
    })

    return Promise.resolve()
  }
}

/*
export const ActionSetStore = (newVal) => {
  return async function(dispatch, getState, { fmWeb3 }){

    const contractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'

    const contractInstance = new fmWeb3.eth.Contract(Box.abi, contractAddress)

    const state = getState()

    const { ethAddress } = state.root.profile

    await contractInstance.methods.store(newVal).send({from: ethAddress})

    return Promise.resolve()
  }
}

export const ActionRetrieveStore = () => {
  return async function(dispatch, getState, { fmWeb3 }){

    const contractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'

    const contractInstance = new fmWeb3.eth.Contract(Box.abi, contractAddress)

    let storedVal = await contractInstance.methods.retrieve().call()

    await dispatch({
      type: ProfileActionTypes.SET_BOX_VALUE,
      value: parseFloat(storedVal)
    })

    return Promise.resolve()
  }
}
*/

/*
*************************************************************************************
* Reducer
*************************************************************************************
 */
export default {

  profile: (state = initialState, action) => {

    switch (action.type){
      case ProfileActionTypes.READY:
        return {
          ...state,
          ready: true
        }

      case ProfileActionTypes.LOGOUT:
        return {
          ...state,
          did: null,
          loading: true
        }

      // we set this first so we show the loading screen
      case ProfileActionTypes.LOGGING_IN:
        return {
          ...state,
          loading: true
        }

      case ProfileActionTypes.REGISTER:
        return {
          ...state,
          email: action.email,
          ethAddress: action.ethAddress
        }

      case ProfileActionTypes.SET_ETH_ADDRESS:
        return {
          ...state,
          ethAddress: action.ethAddress
        }
    }

    return state
  }
}
