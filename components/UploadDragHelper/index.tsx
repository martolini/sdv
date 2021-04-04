import { useDropzone } from 'react-dropzone';
import { Pane, Paragraph, toaster, useTheme } from 'evergreen-ui';
import { useCallback } from 'react';
import { parseXml } from 'utils/parser';
import { useParsedGame } from 'hooks/useParsedGame';

const UploadDragHelper: React.FC = () => {
  const { setParsedGame, setLoading } = useParsedGame();
  const theme = useTheme();
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Do whatever you want with the file contents
        console.time('Parsing');

        try {
          const parsedGame = parseXml(reader.result as string);
          setParsedGame(parsedGame);
        } catch (ex) {
          toaster.danger('Error parsing file', {
            description: ex.message,
          });
        } finally {
          console.timeEnd('Parsing');
          setLoading(false);
        }
      };
      setLoading(true);
      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, isDragActive } = useDropzone({ onDrop });
  console.log(isDragActive);
  return (
    <div {...getRootProps()}>
      <div
        style={{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
          zIndex: 99999,
        }}
      >
        {isDragActive && (
          <Pane
            background={theme.overlayBackgroundColor}
            left={0}
            right={0}
            top={0}
            bottom={0}
            position="absolute"
            zIndex={999999}
            height="100%"
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="50%"
            >
              <Paragraph color="white" fontSize={80} letterSpacing="0.8px">
                Drop your file anywhere, I've got it!
              </Paragraph>
            </Pane>
          </Pane>
        )}
      </div>
    </div>
  );
};

export default UploadDragHelper;
