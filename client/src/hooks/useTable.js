import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import Web3 from 'web3'

export const useTable = (tableName) => {

  const [ethConfig, ] = useContext(EthContext)

  const [tableMetadata, setTableMetadata] = useState()
  const [tableSchema, setTableSchema] = useState()

  useEffect(() => {
    (async () => {
      if (!tableName){
        setTableMetadata(null)
        return
      }

      const metadata = await ethConfig.elajs.getTableMetadata(tableName)

      setTableMetadata(metadata)

    })()
  }, [ethConfig, tableName])

  useEffect(() => {
    (async () => {
      if (!tableName){
        setTableSchema(null)
        return
      }

      const schema = await ethConfig.elajs.getTableSchema(tableName)

      const colsResult = schema.columns.map((colData) => {
        return {
          name: Web3.utils.hexToString(colData.name),
          type: Web3.utils.hexToString(colData._dtype),
        }
      })

      setTableSchema(colsResult)

    })()
  }, [ethConfig, tableName])


  return {tableMetadata, tableSchema}
}
