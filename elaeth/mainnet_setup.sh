# Step 0: mount disk, may not need. Please make sure /dev/nvme0n1 exists before you execute
mount /dev/nvme0n1 /opt;

# Step 1: Start geth
pm2 start --name mainnet-geth -x /opt/geth -- --syncmode "full" --gcmode "archive" --rpc --rpcaddr "0.0.0.0" --rpcport "8545" --rpcapi "eth,admin,web3,net,debug,personal,txpool" --rpccorsdomain "*" -rpcvhosts="*" --nousb --ws --wsaddr "0.0.0.0" --wsport "8546" --wsorigins "*" --datadir "/opt/data"
# check logs
pm2 logs mainnet-geth
# if it does not sync block, try to remove the data/. Please backup the /opt/data/keystore if needed
# rm -rf /opt/data

# Step 2: start explorer
cd /opt/blockscout/docker/;

# check docker images output, should output sth, otherwise you need to restart docker
docker images;
sudo service docker restart

make start;

# Step 3: Start ens service
docker start docker_graph-node_1 postgres-graph docker_ipfs_1;
