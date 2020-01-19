/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { useState } from 'react';
import parser from 'fast-xml-parser';
import { useRouter } from 'next/router';
import { useStoreActions } from 'easy-peasy';
import uuid from 'uuid/v4';
import { getStorage, getFirestore } from '../utils/firebase';
import { goCrazyWithJson } from '../utils/stardew';

export default function HandleFileDrop({ children }) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const router = useRouter();
  const setGamestate = useStoreActions(actions => actions.setFullState);
  const onDrop = async ev => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        const reader = new FileReader();
        const uid = uuid();
        reader.onload = async theFile => {
          const { result } = theFile.currentTarget;
          await getStorage()
            .ref()
            .child(`backups/${uid}`)
            .putString(result, undefined, {
              contentType: 'text/xml',
              cacheControl: 'max-age=43200',
            });
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
                rawUpload: uid,
              }),
          ];
          await Promise.all(promises);
          setGamestate(state);
          router.push({
            pathname: router.pathname,
            query: {
              id: state.info.id,
            },
          });

          setIsDraggingFile(false);
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex="0"
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
      {isDraggingFile ? <h1>Drop file anywhere</h1> : children}
    </div>
  );
}
