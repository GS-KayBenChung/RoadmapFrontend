interface TableColumn {
  header: string;
  accessor: string; 
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
}

export default function TableComponent({ columns, data }: TableProps){
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-4 py-2 text-left border-b font-semibold text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-gray-100">
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-4 py-2 border-b text-gray-700"
                >
                  {row[column.accessor] || 'example'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};