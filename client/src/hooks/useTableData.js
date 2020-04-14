import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import Web3 from 'web3'

export const useTableData = (tableName, schema) => {

  const [ethConfig, ] = useContext(EthContext)

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    (async () => {

      if (!tableName || !schema){
        return
      }

      const tableIds = await ethConfig.elajs.getTableIds(tableName)

      const rowQueries = tableIds.map((id) => {
        return schema.map((col) => {
          return ethConfig.elajs._getVal(tableName, id, col.name)
        })
      })

      let rowData = []

      // rowQueries is an array of arrays of Promises
      for (let i = 0; i < rowQueries.length; i++){

        // for each row, we update tableData
        let results = [tableIds[i], ...await Promise.all(rowQueries[i])]

        rowData.push(results)

        setTableData(rowData)
      }

    })()

  }, [ethConfig, tableName, schema])

  return tableData
}
