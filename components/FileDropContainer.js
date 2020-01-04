import { useState } from 'react';
import parser from 'fast-xml-parser';
import { useRouter } from 'next/router';
import { getStorage } from '../utils/firebase';

export default function HandleFileDrop(props) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const router = useRouter();
  const onDrop = async ev => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        var file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = async theFile => {
          const { result } = theFile.currentTarget;
          const json = parser.parse(result, {
            ignoreAttributes: false,
            parseAttributeValue: true,
          });
          // Parse main info
          const info = json.SaveGame;
          const id = `${info.uniqueIDForThisGame}-${info.year}-${info.currentSeason}-${info.dayOfMonth}`;
          // Upload if it doesn't exist
          const ref = getStorage()
            .ref()
            .child(`farms/${id}`);
          await ref.putString(JSON.stringify(json), undefined, {
            contentType: 'application/json',
            cacheControl: 'max-age=43200',
          });
          setIsDraggingFile(false);
          router.push({
            pathname: router.pathname,
            query: {
              id,
            },
          });
          props.onFinished();
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={event => {
        if (event.dataTransfer.items.length && !isDraggingFile) {
          setIsDraggingFile(true);
        }
        event.preventDefault();
      }}
      onDragEnd={() => setIsDraggingFile(false)}
      onMouseOut={() => {
        setIsDraggingFile(false);
      }}
      onMouseLeave={() => {
        setIsDraggingFile(false);
      }}
      onMouseUp={e => {
        e.preventDefault();
        setIsDraggingFile(false);
      }}
      style={{
        minHeight: '100vh',
        width: '100%',
        background: isDraggingFile ? '#ccc' : '#fff',
      }}
    >
      {isDraggingFile ? <h1>Drop file anywhere</h1> : props.children}
    </div>
  );
}
