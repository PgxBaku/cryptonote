/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */

var log,
  search,
  response = new Object();

define(["N/log", "N/search"], main);

function main(logModule, searchModule) {
  log = logModule;
  search = searchModule;

  return { post: postProcess };
}
  
    function postProcess(request) {
        var searchId = request.searchId; // ID of the saved search

        // Load the saved search
        var savedSearch = search.load({
            id: searchId
        });

        // Define the results array
        var results = [];
        var resultCount = 0;

        // Run the search and process each result
        savedSearch.run().each(function(result) {
            var resultObj = {};
            result.columns.forEach(function(column) {
                var label = column.label || column.name;
                resultObj[label] = result.getValue(column);
            });
            results.push(resultObj);
            resultCount++;
            return true; // Continue to the next result
        });

        // Format results for printing (e.g., JSON or HTML)
        var formattedResults = JSON.stringify(results, null, 2); // For JSON format

        // Alternatively, format as HTML table
        var htmlResults = '<table><thead><tr>';
        for (var col in results[0]) {
            htmlResults += '<th>' + col + '</th>';
        }
        htmlResults += '</tr></thead><tbody>';
        results.forEach(function(row) {
            htmlResults += '<tr>';
            for (var col in row) {
                htmlResults += '<td>' + row[col] + '</td>';
            }
            htmlResults += '</tr>';
        });
        htmlResults += '</tbody></table>';

        // Return formatted results
        return {
            jsonResults: formattedResults,
            htmlResults: htmlResults,
            count: resultCount
        };
    }

    