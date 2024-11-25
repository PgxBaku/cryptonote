/*
Install NewMan, Node.js, NPM to run.

This script runs the postman and then writes the response into a json file.
It orders the properties in the json file alphabetically first before writing to file.

VSCODE with PowerShell
Console Command to bring newman locally: npm link newman
Console Command to run : node mainRun Dev

*/

for (let i = 0; i < process.argv.length; i++) {
  console.log(`${i} : ${process.argv[i]}`);
}

const newman = require("newman"); // require newman in your project
const fs = require("fs");
const { isNullOrUndefined } = require("core-util-is");
const { isEmpty, result } = require("lodash");

const env = process.argv[2];

//console.log(Date.now())

// call newman.run to pass `options` object and wait for callback
newman
  .run({
    collection: require(`./postman/AnyPointApiData_${env}.json`),
    reporters: "cli"
  })
  .on("beforeRequest", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    if (data.request.body) {
      const requestName = data.item.name.replace(/[^a-z0-9]/gi, "-");
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
  .on("request", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    const requestName = data.item.name.replace(/[^a-z0-9]/gi, "-");
    //const randomString = Math.random().toString(36).substring(7);

    const dtStamp = Date.now().toString();
    const fileName = `newmanResults/${dtStamp}-res-a-${requestName}.json`;
    const fileNameBi = `newmanResults/PowerBi-a-${requestName}.json`;
    const bFileName = `newmanResults/${dtStamp}-res-b-${requestName}.json`;
    const bFileNameBi = `newmanResults/PowerBi-res-b-${requestName}.json`;
    var results = data.response.json();

    var coresUsed = 0;
    var totalCores = 0;

    //console.log(data.response.json())

    results.sort(function (a, b) {
      if (a.domain > b.domain) return 1;
      if (a.domain < b.domain) return -1;
      return 0;
    });

    let newResult = [];

    for (let i = 0; i < results.length; i++) {
      let item = results[i];

      let n = i + 1;

      var newResultItem = {};
      newResultItem["Number"] = i + 1;
      newResultItem["Environment"] = `${env}`;
      newResultItem["Status"] = item.status;
      newResultItem["AutoDiscoveryId"] = item.properties["api.autodiscoveryID"];
      newResultItem["ApplicationName"] = item.domain;
      newResultItem["ApiVersion"] = item.properties["api.version"];
      newResultItem["Workers"] = item.workers.amount;
      newResultItem["Region"] = item.region;
      var coresInfo = item.workers.type.cpu.replace("vCores", "");
      coresInfo = coresInfo.replace("vCore", "");
      newResultItem["Cores"] = coresInfo;
      newResultItem["TotalCores"] = coresInfo * item.workers.amount;
      newResultItem["CoresUsedTotal"] =
        item.workers.remainingOrgWorkers + "/" + item.workers.totalOrgWorkers;

      newResultItem["Memory"] = item.workers.type.memory.replace("memory", "");
      //newResultItem['StaticIp'] = item.ipAddresses[0]?.address

      //Remove Text and convert to number
      if (newResultItem["Memory"]) {
        var tmem = newResultItem["Memory"];
        if (tmem.includes("MB")) {
          newResultItem["Memory"] = tmem.replace("MB", "") * 1;
          //console.log(newResultItem["Memory"]);
        }
        if (tmem.includes("GB")) {
          newResultItem["Memory"] = tmem.replace("GB", "") * 1024;
          //console.log(newResultItem["Memory"]);
        }
      }

      //console.log(item.workers.remainingOrgWorkers);
      if (item.workers.remainingOrgWorkers > coresUsed) {
        coresUsed = item.workers.remainingOrgWorkers;
      }

      if (item.workers.totalOrgWorkers > totalCores)
        totalCores = item.workers.totalOrgWorkers;

      newResultItem["CoresUsed"] = 0;
      newResultItem["CoresTotal"] = 0;

      const ipAddressString = [];
      var ipAddressCount = 0
      for (let j = 0; j < item.ipAddresses.length; j++) {
        //console.log(item.domain + " : " + item.ipAddresses[j].address)

        ipAddressString.push(item.ipAddresses[j].address);
        ipAddressCount++;
      }
      newResultItem["IpAddresses"] = ipAddressString.flat();
      newResultItem["IpAddressesCount"] = ipAddressCount;
      
      newResult.push(newResultItem);
    }

    for (let i = 0; i < newResult.length; i++) {
      newResult[i].CoresUsed = coresUsed;
      newResult[i].CoresTotal = totalCores;
    }

    const content = JSON.stringify(newResult);

    /*
    fs.writeFile(fileName, content, function (error) {
      if (error) {
        console.error(error);
      }
    });
*/
    fs.writeFile(fileNameBi, content, function (error) {
      if (error) {
        console.error(error);
      }
    });

    /*
    const contentb = JSON.stringify(results);

    fs.writeFile(bFileName, contentb, function (error) {
      if (error) {
        console.error(error);
      }
    });
*/

    const contentb = JSON.stringify(results);

    fs.writeFile(bFileNameBi, contentb, function (error) {
      if (error) {
        console.error(error);
      }
    });
    /// TODO: all global error handling
  });
