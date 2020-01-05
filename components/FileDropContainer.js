import { useState } from 'react';
import parser from 'fast-xml-parser';
import { useRouter } from 'next/router';
import { getStorage, getFirestore } from '../utils/firebase';
import { uniqBy } from 'lodash';
import { goCrazyWithJson } from '../utils/stardew';

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
          const state = await goCrazyWithJson(json.SaveGame);
          // Upload if it doesn't exist
          const ref = getStorage()
            .ref()
            .child(`farms/${state.info.id}`);
          router.push({
            pathname: router.pathname,
            query: {
              id: state.info.id,
            },
          });

          const promises = [
            ref.putString(JSON.stringify(json), undefined, {
              contentType: 'application/json',
              cacheControl: 'max-age=43200',
            }),
            getFirestore()
              .collection('uploads')
              .doc(state.info.id)
              .set({
                id: state.info.id,
                farmName: state.info.farmName,
                uploadedAtMillis: Date.now(),
              }),
            getStorage()
              .ref()
              .child(`backups/${state.info.id}`)
              .putString(result, undefined, {
                contentType: 'text/xml',
                cacheControl: 'max-age=43200',
              }),
          ];
          await Promise.all(promises);
          setIsDraggingFile(false);
          props.onFinished(state);
        };
        reader.readAsText(file);
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {}
    }
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={event => {
        if (event.dataTransfer.items.length) {
          setIsDraggingFile(true);
        }
        event.preventDefault();
      }}
      onDragEnd={() => setIsDraggingFile(false)}
      onMouseOut={() => {
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
