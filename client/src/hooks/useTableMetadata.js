import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import Web3 from 'web3'

export const useTableMetadata = (tableName) => {

  const [ethConfig, ] = useContext(EthContext)

  const [metadata, setMetadata] = useState()
  const [schema, setSchema] = useState()

  useEffect(() => {
    (async () => {
      if (!tableName){
        return
      }

      const metadata = await ethConfig.elajs.getTableMetadata(tableName)

      setMetadata(metadata)

    })()
  }, [ethConfig, tableName])

  useEffect(() => {
    (async () => {
      if (!tableName){
        return
      }

      const schema = await ethConfig.elajs.getTableSchema(tableName)

      const colsResult = schema.columns.map((colData) => {
        return {
          name: Web3.utils.hexToString(colData.name),
          type: Web3.utils.hexToString(colData._dtype),
        }
      })

      setSchema(colsResult)

    })()
  }, [ethConfig, tableName])


  return {metadata, schema}
}
