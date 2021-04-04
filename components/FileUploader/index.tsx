import { Card, Pane, toaster } from 'evergreen-ui';
import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { ParsedGame, parseXml } from 'utils/parser';
import UploadBody from './UploadBody';
import UploadBodySmall from './UploadBodySmall';

type FileUploaderProps = {
  onFinished: (parsedGame: ParsedGame) => void;
  small?: boolean;
};

export default function FileUploader({ onFinished, small }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Do whatever you want with the file contents
        console.time('Parsing');
        try {
          const parsedGame = parseXml(reader.result as string);
          onFinished(parsedGame);
        } catch (ex) {
          toaster.danger('Error parsing file', {
            description: ex.message,
          });
        } finally {
          console.timeEnd('Parsing');
        }
      };
      reader.readAsText(file);
    });
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const borderColor = useMemo(() => {
    if (isDragAccept) {
      return '#00e676';
    }
    if (isDragActive) {
      return '#2196f3';
    }
    if (isDragReject) {
      return '#ff1744';
    }
  }, [isDragActive, isDragAccept, isDragReject]);
  return (
    <Pane width={small ? '130px' : '600px'}>
      <div {...getRootProps()}>
        <Card
          elevation={3}
          hoverElevation={4}
          height={small ? '36px' : '250px'}
          display="flex"
          justifyContent="space-around"
          textAlign="left"
          alignItems="center"
          padding={small ? 3 : 20}
          border
          borderColor={borderColor}
          flexDirection={small ? 'row' : 'column'}
        >
          <input {...getInputProps()} />
          {small ? <UploadBodySmall /> : <UploadBody />}
        </Card>
      </div>
    </Pane>
  );
}
