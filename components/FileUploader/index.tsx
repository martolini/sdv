import { Card, CloudUploadIcon, Heading, Pane } from 'evergreen-ui';
import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { ParsedGame, parseXml } from 'utils/parser';

type FileUploaderProps = {
  onFinished: (parsedGame: ParsedGame) => void;
};

export default function FileUploader({ onFinished }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        console.time('Parsing');
        const parsedGame = parseXml(reader.result as string);
        console.timeEnd('Parsing');
        onFinished(parsedGame);
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
  } = useDropzone({ onDrop, accept: 'text/xml' });

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
    <Pane width="500px">
      <div {...getRootProps({ borderColor })}>
        <Card
          elevation={3}
          hoverElevation={4}
          height="200px"
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          padding={20}
          border
          borderColor={borderColor}
          flexDirection="column"
        >
          <input {...getInputProps()} />
          <Heading size={700} fontFamily="VT323" letterSpacing={0.6}>
            Click or drag files here to upload your farm
          </Heading>
          <CloudUploadIcon size={50} color="info" />
        </Card>
      </div>
    </Pane>
  );
}
