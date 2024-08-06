import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, Trash2, Plus, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setData(results.data.slice(1));
      },
      header: false,
    });
  }, []);

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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">CSV Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors duration-300 hover:border-blue-500"
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg">Drop the CSV file here ...</p>
          ) : (
            <p className="text-lg">Drag 'n' drop a CSV file here, or click to select a file</p>
          )}
        </div>

        {fileName && (
          <Alert className="mb-6">
            <FileSpreadsheet className="h-4 w-4" />
            <AlertTitle>File loaded</AlertTitle>
            <AlertDescription>{fileName}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence>
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-x-auto">
                <Table className="w-full mb-6">
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index} className="font-bold">{header}</TableHead>
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
                              className="w-full"
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRow(rowIndex)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={handleAddRow} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Row
                </Button>
                <CSVLink
                  data={[headers, ...data]}
                  filename={`edited_${fileName || 'data'}.csv`}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </CSVLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <CSVEditor />
    </div>
  );
};

export default Index;
