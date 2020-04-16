import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import Web3 from 'web3'

export const useTableData = (tableName, tableSchema) => {

  const [ethConfig, ] = useContext(EthContext)

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    (async () => {

      setTableData([])

      if (!tableName || !tableSchema){
        return
      }

      const tableIds = await ethConfig.elajs.getTableIds(tableName)

      const rowQueries = tableIds.map((id) => {
        return tableSchema.map((col) => {
          return ethConfig.elajs._getVal(tableName, id, col.name)
        })
      })

      if (rowQueries.length === 0){
        return
      }

      let rowData = []

      // rowQueries is an array of arrays of Promises
      for (let i = 0; i < rowQueries.length; i++){

        // for each row, we update tableData
        let results = [tableIds[i], ...await Promise.all(rowQueries[i])]

        rowData.push(results)

        setTableData(rowData.slice())
      }

    })()

  }, [ethConfig, tableName, tableSchema])

  return tableData
}
