import { toaster } from 'evergreen-ui';
import { useCallback, useState } from 'react';
import { parseXml } from 'utils/parser';
import { useParsedGame } from 'hooks/useParsedGame';

const UploadDragHelper: React.FC = ({ children }) => {
  const { setParsedGame, setLoading } = useParsedGame();
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const onDrop = useCallback((ev) => {
    ev.preventDefault();
    setIsDraggingFile(false);
    if (ev.dataTransfer.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile();
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
      }
    }
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      onDrop={onDrop}
      onDragOver={(event) => {
        if (event.dataTransfer.items.length) {
          setIsDraggingFile(true);
        }
        event.preventDefault();
      }}
      onDragEnd={() => setIsDraggingFile(false)}
      onMouseOut={() => {
        setIsDraggingFile(false);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
      }}
    >
      {isDraggingFile ? (
        <div
          style={{
            margin: 'auto',
            width: '50%',
            height: '50%',
            marginTop: '10%',
          }}
        >
          <h1 style={{ textAlign: 'center', fontFamily: 'VT323, monospace' }}>
            Drop file anywhere
          </h1>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default UploadDragHelper;
