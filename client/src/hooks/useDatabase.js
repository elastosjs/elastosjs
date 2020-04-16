import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import { NetworkContext } from '../context/NetworkContext'
import Web3 from 'web3'
import { contracts } from '../config'

export const useDatabase = (isAdmin) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)
  const [network, setNetwork] = useContext(NetworkContext)

  const [databases, setDatabases] = useState([])

  useEffect(() => {
    (async () => {

      if (isAdmin){
        setDatabases(await getAdminDatabases(ethConfig, network))
        return
      }

    })()
  }, [ethConfig, network, isAdmin])

  return databases
}

/**
 * Admin only has one database, which is the one running ElastosJS
 */
const getAdminDatabases = async (ethConfig, network) => {

  const tables = await ethConfig.elajs.getTables()
  const gsnBalance = parseFloat(Web3.utils.fromWei(await ethConfig.elajs.getGSNBalance()))

  return [{
    name: 'ElastosJS',
    contractAddress: contracts[network].elajsStore,
    gsnBalance,
    tables: tables.map((table) => {
      return {
        name: Web3.utils.hexToString(table)
      }
    })
  }]
}
