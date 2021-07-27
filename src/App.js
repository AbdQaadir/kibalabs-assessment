import { useState, useEffect } from 'react';
import { readRemoteFile } from 'react-papaparse';
import queryString from 'query-string';
import './App.css';

import csvFile from './cities.csv';

import TableRow from './TableRow';



function App() {
  const [data, setData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [query, setQuery] = useState("");


  const readLocalCSVFile = () => {
    
    readRemoteFile(csvFile, {
      complete: function (results, file) {       
        const formatedResults = results.data.splice(1).map((result) => {
          let dataObj = {};
          [dataObj["#"],
          dataObj["City"],
          dataObj["Country"],
          dataObj["All Buildings"],
          dataObj["100m"],
          dataObj["150m"],
          dataObj["200m"],
          dataObj["300m"],
          dataObj["Telecom Towers"],
          dataObj["All Structures"],
          ] = result;
          return {...dataObj}
        })
        
        setTableHeader(results.data[0]);
        setData(formatedResults);
      }
    });
  }

  const titleCase = (str) => {
    return str.toLowerCase().split(' ').map(function(word) {
      if(isNaN(word[0])){
        return word.replace(word[0], word[0].toUpperCase());
      }
      else {
        return word;
      }
    }).join(' ');
  }

  useEffect(() => {

    readLocalCSVFile();

    let { orderByField } = queryString.parse(window.location.search);

    if(orderByField){
      orderByField = orderByField.trim();
      setQuery(titleCase(orderByField));
    }else{
      setQuery("#");
    }

  }, [])



 const filteredData = data.sort((x, y) => {

   if(isNaN(x[query])) return x[query] > y[query] ? 1 : -1

   return Number(x[query]) > Number(y[query]) ? 1 : -1;
  }
);

  return (
    <table>
      <thead>
        <tr>
          {tableHeader?.map((headerTitle, index) => {
            return (
              <th key={index.toString()}>
                {headerTitle.replace(/\n/g, ' ')}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {filteredData?.map(( rowData, index ) => <TableRow rowData={rowData} key={index.toString()} />)}
      </tbody>
    </table>
  );
}

export default App;
