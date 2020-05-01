import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/EthContext'
import Web3 from 'web3'

export const useTableData = (tableName, tableSchema, isAdmin) => {

  const [ethConfig, ] = useContext(EthContext)

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    (async () => {

      setTableData([])

      if (!tableName || !tableSchema){
        return
      }

      let tableIds

      if (isAdmin){
        tableIds = await ethConfig.elajsDb.getTableIds(tableName)
      } else {
        tableIds = await ethConfig.elajsDbUser.getTableIds(tableName)
      }

      // this fires off a multitude of async SC calls
      const rowQueries = tableIds.map((id) => {
        return tableSchema.map((col) => {
          if (isAdmin){
            return ethConfig.elajsDb.getVal(tableName, id, col.name)
          } else {
            return ethConfig.elajsDbUser.getVal(tableName, id, col.name)
          }
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
