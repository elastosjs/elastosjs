import { useEffect, useContext, useState } from 'react'
import { EthContext } from '../context/EthContext'


export const useGsnBalanceMap = (databases, effectTrigger) => {

  const [ethConfig, ] = useContext(EthContext)

  const [gsnBalanceMap, setGsnBalanceMap] = useState({})

  useEffect(() => {
    (async () => {

      const gsnBalanceMap = {}
      const elajsDbUser = ethConfig.elajsDbUser

      for (let i = 0, len = databases.length; i < len; i++){
        const db = databases[i]

        try {
          elajsDbUser.setDatabase(db.contractAddress)
          await elajsDbUser.defaultWeb3.currentProvider.baseProvider.enable() // we should call enable for each setDatabase change

          gsnBalanceMap[db.contractAddress] = await elajsDbUser.getGSNBalance()
          setGsnBalanceMap(Object.assign({}, gsnBalanceMap))
        } catch (err){
          console.error(`Error fetching GSNBalance for contract address: ${db.contractAddress}`, err)
        }
      }
    })()
  }, [ethConfig, databases, setGsnBalanceMap, effectTrigger])

  return gsnBalanceMap
}
