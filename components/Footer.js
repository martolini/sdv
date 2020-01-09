import { useEffect, useState } from 'react';
import { Layout, Tag, notification } from 'antd';
import { getFirestore } from '../utils/firebase';

const { Footer: AntFooter } = Layout;

export default function Footer(props) {
  const [recents, setRecents] = useState([]);
  useEffect(() => {
    return getFirestore()
      .collection('uploads')
      .orderBy('uploadedAtMillis', 'desc')
      .limit(5)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === 'added' || change.type === 'modified') {
            // Assume non-first run
            const d = change.doc.data();
            if (d.uploadedAtMillis > Date.now() - 10 * 1000) {
              const [_, year, season, day] = d.id.split('-');
              notification.success({
                message: `New upload from ${d.farmName}`,
                description: `Day ${day} in ${season}, year ${year}, click to see it!`,
                onClick: () => {
                  window.location.href = window.location.href = `${
                    window.location.href.split('?')[0]
                  }?id=${d.id}`;
                },
              });
            }
          }
        });
        if (!snapshot.empty) {
          const saveGames = [];
          snapshot.forEach(doc => {
            saveGames.push(doc.data());
          });
          setRecents(saveGames);
        }
      });
  }, []);
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      <p>
        {recents.map(r => (
          <Tag
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.href = `${
                window.location.href.split('?')[0]
              }?id=${r.id}`;
            }}
            key={r.id}
            color="geekblue"
          >{`${r.farmName} // ${r.id
            .split('-')
            .slice(1)
            .join(' ')}`}</Tag>
        ))}
      </p>
      <p>{'martolini <3 stardew'}</p>
    </AntFooter>
  );
}
