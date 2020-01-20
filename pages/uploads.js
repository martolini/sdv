import { useCollection } from 'react-firebase-hooks/firestore';
import { List, Skeleton, Card } from 'antd';
import styled from 'styled-components';
import { getFirestore } from '../utils/firebase';

// eslint-disable-next-line react/no-array-index-key
const loadingComponent = [1, 2, 3, 4, 5].map(i => <Skeleton key={i} />);

const StyledCard = styled(Card)`
  &:hover {
    opacity: 0.7;
  }
`;

export default function uploads() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, loading] = useCollection(
    getFirestore()
      .collection('uploads')
      .orderBy('uploadedAtMillis', 'desc')
      .limit(10)
  );
  const items = value
    ? value.docs.map(doc => {
        const data = doc.data();
        const [, year, season, day] = data.id.split('-');
        const description = `${season} ${day}, year ${year}`;
        return (
          <List.Item key={data.id} style={{ cursor: 'pointer' }}>
            <StyledCard title={data.farmName}>
              <p>{description}</p>
              <p>
                Uploaded at {new Date(data.uploadedAtMillis).toDateString()}
              </p>
            </StyledCard>
          </List.Item>
        );
      })
    : [];
  if (loading) {
    return loadingComponent;
  }
  return (
    <List
      grid={{ gutter: 16, column: { xs: 24, m: 4, l: 4 } }}
      dataSource={items}
      renderItem={item => item}
    />
  );
}
