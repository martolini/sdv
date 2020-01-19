import { useEffect, useState } from 'react';
import { Layout, notification, Icon, Divider, Tag } from 'antd';
import styled from 'styled-components';
import { getFirestore } from '../utils/firebase';
import pkg from '../package.json';
import ExternalLink from './ExternalLink';

const { Footer: AntFooter } = Layout;

const CenteredSpacing = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;

  .ant-tag {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }

  ul {
    list-style: none;
    flex-wrap: wrap;
    display: flex;
    padding-inline-start: 0;
    margin-bottom: 0;
    * {
      display: flex;
      margin-right: 20px;
    }
  }
`;

export default function Footer() {
  const [recents, setRecents] = useState([]);
  useEffect(() => {
    return getFirestore()
      .collection('uploads')
      .orderBy('uploadedAtMillis', 'desc')
      .limit(5)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added' || change.type === 'modified') {
            // Assume non-first run
            const d = change.doc.data();
            if (d.uploadedAtMillis > Date.now() - 10 * 1000) {
              const [, year, season, day] = d.id.split('-');
              notification.success({
                message: `New upload from ${d.farmName}`,
                description: `Day ${day} in ${season}, year ${year}, click to see it!`,
                onClick: () => {
                  window.location.href = `${
                    window.location.href.split('?')[0]
                  }?id=${d.id}`;
                },
                duration: 10,
                style: {
                  cursor: 'pointer',
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
    <AntFooter>
      <CenteredSpacing>
        <ul style={{ width: '100%', justifyContent: 'center' }}>
          {recents.map(r => (
            <li key={r.id}>
              <a
                href={`${window.location.href.split('?')[0]}?id=${r.id}`}
                key={r.id}
              >
                <Tag color="geekblue" style={{ cursor: 'pointere' }}>{`${
                  r.farmName
                } // ${r.id
                  .split('-')
                  .slice(1)
                  .join(' ')}`}</Tag>
              </a>
            </li>
          ))}
        </ul>
      </CenteredSpacing>
      <Divider />
      <CenteredSpacing>
        <ul style={{ width: '100%' }}>
          <li>{`Version ${pkg.version} `}</li>
          <li>
            <ExternalLink
              href={`https://github.com/martolini/sdv/blob/v${pkg.version}/CHANGELOG.md`}
            >
              See changelog
            </ExternalLink>
          </li>
          <li>All credits in the world to ConcernedApe</li>
          <li style={{ marginLeft: 'auto', marginRight: 5 }}>
            <ExternalLink href="https://github.com/martolini/sdv">
              Check out the project on github
              <Icon type="github" style={{ fontSize: 24, marginLeft: 5 }} />
            </ExternalLink>
          </li>
        </ul>
      </CenteredSpacing>
    </AntFooter>
  );
}
