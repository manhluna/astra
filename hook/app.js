const FlexContract = require('flex-contract');
const abi = require('./MyContract.ABI.json');
const deployed_at = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const contract = (abi, deployed_at) => {
    return new FlexContract(abi, deployed_at);
}

function live(contract,from,to,fn){
    try {
        let watcher = contract.Transfer.watch({
            args: {
                'from': from, // Addr of user
                'to': to // Addr of astra
            }
         });
         watcher.on('data', (event) => {
             fn(event)
             //watcher.close();
         });
    } catch (err) {
        console.log(err);
    }
}

live(contract(abi,deployed_at),'0xb0BBd32493fa16A8a26f1Bd0FC027a0e92b9605b','0xdac17f958d2ee523a2206206994597c13d831ec7',(event) => {
    //handle events
})