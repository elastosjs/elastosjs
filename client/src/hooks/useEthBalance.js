import { useState, useContext, useEffect } from 'react'
import Web3 from 'web3'
import { EthContext } from '../context/EthContext'

export const useEthBalance = (effectTrigger) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [ethBalance, setEthBalance] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')

  const fmWeb3 = ethConfig.fmWeb3

  useEffect(() => {
    (async () => {

      const accounts = await fmWeb3.eth.getAccounts()

      setWalletAddress(accounts[0])

      const balance = parseFloat(Web3.utils.fromWei(await fmWeb3.eth.getBalance(accounts[0])))

      setEthBalance(balance)

    })()
  }, [ethConfig, effectTrigger])

  return {ethBalance, walletAddress}

}
