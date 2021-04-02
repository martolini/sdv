import {
  Card,
  CloudUploadIcon,
  Pane,
  ParagraphProps,
  Paragraph,
  ClipboardIcon,
  toaster,
} from 'evergreen-ui';
import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { ParsedGame, parseXml } from 'utils/parser';
import { CopyToClipboard } from 'react-copy-to-clipboard';

type FileUploaderProps = {
  onFinished: (parsedGame: ParsedGame) => void;
};

const ParagraphWithFont = (props: ParagraphProps & { fontFamily: string }) => (
  // @ts-ignore
  <Paragraph {...props} fontFamily="VT323" />
);

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
    <Pane width="600px">
      <div {...getRootProps({ borderColor })}>
        <Card
          elevation={3}
          hoverElevation={4}
          height="250px"
          display="flex"
          justifyContent="space-around"
          textAlign="left"
          alignItems="center"
          padding={20}
          border
          borderColor={borderColor}
          flexDirection="column"
        >
          <input {...getInputProps()} />
          <CloudUploadIcon size={40} color="info" alignSelf="center" />
          <Paragraph fontSize="1.5rem" fontFamily="mono" letterSpacing={0.6}>
            Drag and drop a save file to this area to upload
          </Paragraph>
          <Paragraph fontSize="1" fontFamily="mono" letterSpacing={0.6}>
            The save file (e.g. named Player_123456789) is located under:
          </Paragraph>
          <Paragraph fontSize="1" fontFamily="mono" letterSpacing={0.6}>
            <>
              <span>Windows: %AppData%\StardewValley\Saves\</span>
              <CopyToClipboard
                text="%AppData%\StardewValley\Saves\"
                onCopy={(e) => {
                  toaster.success(
                    'Copied %AppData%StardewValleySaves to clipboard'
                  );
                }}
              >
                <ClipboardIcon
                  marginLeft="10px"
                  onClick={(e) => e.stopPropagation()}
                  cursor="pointer"
                  color="success"
                />
              </CopyToClipboard>
            </>
          </Paragraph>
          <Paragraph fontSize="1" fontFamily="mono" letterSpacing={0.6}>
            <>
              <span>Mac OSX & Linux: ~/.config/StardewValley/Saves/</span>
              <CopyToClipboard
                text="~/.config/StardewValley/Saves/"
                onCopy={() => {
                  toaster.success(
                    'Copied ~/.config/StardewValley/Saves/ to clipboard',
                    {}
                  );
                }}
              >
                <ClipboardIcon
                  marginLeft="10px"
                  onClick={(e) => e.stopPropagation()}
                  cursor="pointer"
                  color="success"
                />
              </CopyToClipboard>
            </>
          </Paragraph>
        </Card>
      </div>
    </Pane>
  );
}
