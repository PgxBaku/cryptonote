

for (let i = 0; i < process.argv.length; i++)
{
   console.log(`${i} : ${process.argv[i]}`)
}



const newman = require('newman'); // require newman in your project
const fs = require('fs');
const { isNullOrUndefined } = require('core-util-is');
const { isEmpty } = require('lodash');

const env = process.argv[2]

//console.log(Date.now())

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require(`./postman/AnyPointApiData_${env}.json`),
    reporters: 'cli'
}).on('beforeRequest', (error, data) => {
    if (error) {
        console.log(error);
        return;
    }

    if (data.request.body) {
        const requestName = data.item.name.replace(/[^a-z0-9]/gi, '-');
        const randomString = Math.random().toString(36).substring(7);
        const fileName = `request-${requestName}-${randomString}.txt`;
        const content = data.request.body.raw;
        
        fs.writeFile(fileName, content, function (error) {
            if (error) { 
                 console.error(error); 
            }
         });        
    }
})
.on('request', (error, data) => {
    if (error) {
        console.log(error);
        return;
    }

    const requestName = data.item.name.replace(/[^a-z0-9]/gi, '-');
    //const randomString = Math.random().toString(36).substring(7);

    const dtStamp = Date.now().toString();
    const fileName = `newmanResults/${dtStamp}-res-a-${requestName}.json`;
    const bFileName = `newmanResults/${dtStamp}-res-b-${requestName}.json`;
    var results = data.response.json();
    

    results.sort(function (a, b) {
        if (a.domain > b.domain) return 1;
        if (a.domain < b.domain) return -1;
        return 0;})    

    let newResult =[]

    for (let i = 0; i < results.length; i++) {
        let item = results[i];

        let n = i + 1;
      
        //console.log(" : " + n + " : " + `${env}` + " : "
        //+ item.domain + " : "
        //+ item.properties["api.version"] + " : "clea
        //+ item.workers.amount + " : "
        //+ item.workers.type.cpu + " : "
        //+ item.workers.remainingOrgWorkers + "/" + item.workers.totalOrgWorkers + " : "
        //+ item.workers.type.memory + " : "
        //+ item.ipAddresses[0]?.address
        //);

        var newResultItem = {};
        newResultItem['Number'] = i+1;
        newResultItem['Environment'] = `${env}`;
        newResultItem['Status'] = item.status;
        newResultItem['AutoDiscoveryId'] = item.properties["api.autodiscoveryID"]
        newResultItem['ApplicationName'] = item.domain;
        newResultItem['ApiVersion'] = item.properties["api.version"];
        newResultItem['Workers'] = item.workers.amount;
        const coresInfo = item.workers.type.cpu.replace("vCores", "");
        newResultItem['Cores'] = coresInfo;
        newResultItem['TotalCores'] = coresInfo * item.workers.amount;
        newResultItem['CoresAvailTotal'] = item.workers.remainingOrgWorkers + "/" + item.workers.totalOrgWorkers;
        newResultItem['Memory'] = item.workers.type.memory;
        //newResultItem['StaticIp'] = item.ipAddresses[0]?.address

        const ipAddressString =  []
        for (let j = 0; j < item.ipAddresses.length; j++) 
        {
            //console.log(item.domain + " : " + item.ipAddresses[j].address)

            ipAddressString.push(item.ipAddresses[j].address)
            
        }
        newResultItem['IpAddresses'] = ipAddressString.flat()

        newResult.push(newResultItem);
    }

    const content = JSON.stringify( newResult );
    
    fs.writeFile(fileName, content, function (error) {
        if (error) { 
             console.error(error); 
        }
     });


     const contentb = JSON.stringify(results);

     fs.writeFile(bFileName,contentb , function (error) {
        if (error) { 
             console.error(error); 
        }
     });

     /// TODO: all global error handling
});
