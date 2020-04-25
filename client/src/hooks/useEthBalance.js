import { useState, useContext, useEffect } from 'react'
import Web3 from 'web3'
import { EthContext } from '../context/EthContext'

export const useEthBalance = (effectTrigger) => {

  const [ethConfig, ] = useContext(EthContext)

  const [ethBalance, setEthBalance] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')

  const fmWeb3 = ethConfig.fmWeb3

  let balanceCheckInterval

  useEffect(() => {

    // on entry always clear it in case
    if (balanceCheckInterval){
      clearInterval(balanceCheckInterval)
    }

    updateData(fmWeb3, setWalletAddress, setEthBalance)

    balanceCheckInterval = setInterval(() => {
      updateData(fmWeb3, setWalletAddress, setEthBalance)
    }, 15000)

    // this is the clean-up function
    return () => {
      clearInterval(balanceCheckInterval)
    }

  }, [ethConfig, effectTrigger])

  return {ethBalance, walletAddress}

}

const updateData = async (fmWeb3, setWalletAddress, setEthBalance) => {

  console.log('useEthBalance polled')

  const accounts = await fmWeb3.eth.getAccounts()

  setWalletAddress(accounts[0])

  const balance = parseFloat(Web3.utils.fromWei(await fmWeb3.eth.getBalance(accounts[0])))

  setEthBalance(balance)

}
