import { useEffect, useState } from 'react';
import { Layout, Tag } from 'antd';
import { getFirestore } from '../utils/firebase';

const { Footer: AntFooter } = Layout;

export default function Footer(props) {
  const [recents, setRecents] = useState([]);
  useEffect(() => {
    const unsubscribe = getFirestore()
      .collection('uploads')
      .orderBy('uploadedAtMillis', 'desc')
      .limit(5)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const saveGames = [];
          snapshot.forEach(doc => {
            saveGames.push(doc.data());
          });
          setRecents(saveGames);
        }
      });
    return unsubscribe;
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
