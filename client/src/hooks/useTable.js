import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import Web3 from 'web3'

export const useTable = (tableName, isAdmin) => {

  const [ethConfig, ] = useContext(EthContext)

  const [tableMetadata, setTableMetadata] = useState()
  const [tableSchema, setTableSchema] = useState()

  useEffect(() => {
    (async () => {
      if (!tableName){
        setTableMetadata(null)
        return
      }

      let metadata

      if (isAdmin){
        metadata = await ethConfig.elajsDb.getTableMetadata(tableName)
      } else {
        metadata = await ethConfig.elajsDbUser.getTableMetadata(tableName)
      }

      setTableMetadata(metadata)

    })()
  }, [ethConfig, tableName, isAdmin])

  useEffect(() => {
    (async () => {
      if (!tableName){
        setTableSchema(null)
        return
      }

      let schema
      if (isAdmin){
        schema = await ethConfig.elajsDb.getTableSchema(tableName)
      } else {
        schema = await ethConfig.elajsDbUser.getTableSchema(tableName)
      }

      const colsResult = schema.columns.map((colData) => {
        return {
          name: Web3.utils.hexToString(colData.name),
          type: Web3.utils.hexToString(colData._dtype),
        }
      })

      setTableSchema(colsResult)

    })()
  }, [ethConfig, tableName, isAdmin])


  return {tableMetadata, tableSchema}
}
