import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import { NetworkContext } from '../context/NetworkContext'
import Web3 from 'web3'
import { contracts } from '../config'
import constants from '../constants'

export const useDatabase = (profile, effectTrigger) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)
  const [network, setNetwork] = useContext(NetworkContext)

  const [databases, setDatabases] = useState([])

  useEffect(() => {
    (async () => {

      if (profile.isAdmin){
        setDatabases(await getAdminDatabases(ethConfig, network))
        return
      }

      setDatabases(await getDatabases(ethConfig, profile.userId))

    })()
  }, [ethConfig, network, profile.isAdmin, profile.userId, effectTrigger])

  return databases
}

/**
 * Admin only has one database, which is the one running ElastosJS
 */
const getAdminDatabases = async (ethConfig, network) => {

  const tables = await ethConfig.elajs.getTables()

  return [{
    dbName: 'ElastosJS',
    contractAddress: contracts[network].elajsStore,
    tables: tables.map((table) => {
      return {
        name: Web3.utils.hexToString(table)
      }
    })
  }]
}

/**
 * TODO: use thegraph.com or Events WHERE query
 *
 * For now we are using an expensive search over all ids
 *
 * @param ethConfig
 * @param network
 * @returns {Promise<void>}
 */
const getDatabases = async (ethConfig, userId) => {

  // set the database
  await ethConfig.elajsUser.defaultWeb3.currentProvider.baseProvider.enable()

  // fetch all the rows
  const databaseIds = await ethConfig.elajs.getTableIds('database')

  const databases = []

  for (let i = 0, len = databaseIds.length; i < len; i++){

    let id = databaseIds[i]

    let curUserId = await ethConfig.elajs._getVal(constants.SCHEMA.DATABASE_TABLE, id, 'userId')

    if (curUserId === userId){
      // hardcoding the table names
      let dbName = Web3.utils.hexToString(await ethConfig.elajs._getVal(constants.SCHEMA.DATABASE_TABLE, id, 'dbName'))
      let contractAddress = await ethConfig.elajs._getVal(constants.SCHEMA.DATABASE_TABLE, id, 'contractAddress')

      try {
        contractAddress = Web3.utils.toChecksumAddress(contractAddress.substring(0, 42))
      } catch (err){
        // pass
      }

      ethConfig.elajsUser.setDatabase(contractAddress)

      // now for each contract/database we need to fetch the tables!
      let tables = await ethConfig.elajsUser.getTables()

      // GSN balance should be done in another function, this is more involved since each one is its own instance
      databases.push({
        id,
        dbName,
        contractAddress,
        tables: tables.map((table) => {
          return {
            name: Web3.utils.hexToString(table)
          }
        })
      })
    }
  }

  return databases

}
