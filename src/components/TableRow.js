import React from 'react'

const TableRow = ({rowData}) => {
  
    const rowValues = Object.values(rowData);

    return (
      <tr>
        {
            rowValues?.map((columnValue, index) => {
                return <td key={index.toString()}>{columnValue}</td>
            })
        }
      </tr>
    )
  }

export default TableRow
