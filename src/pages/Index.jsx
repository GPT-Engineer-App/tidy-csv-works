import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setData(results.data.slice(1));
      },
      header: false,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleEdit = (rowIndex, columnIndex, value) => {
    const newData = [...data];
    newData[rowIndex][columnIndex] = value;
    setData(newData);
  };

  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill('');
    setData([...data, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Editor</h1>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>
      {data.length > 0 && (
        <>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleEdit(rowIndex, columnIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mb-4">
            <Button onClick={handleAddRow}>Add Row</Button>
            <CSVLink
              data={[headers, ...data]}
              filename="edited_data.csv"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Download CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CSVEditor />
    </div>
  );
};

export default Index;
