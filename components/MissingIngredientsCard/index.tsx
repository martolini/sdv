import CardTitle from 'components/CardTitle';
import { Table, Pane } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import React, { useMemo } from 'react';
import { groupBy } from 'lodash';

const MissingIngredientsCard: React.FC<{ width?: number }> = (props) => {
  const { parsedGame } = useParsedGame();
  if (!parsedGame) {
    return null;
  }
  const deliverables = useMemo(
    () =>
      groupBy(
        parsedGame.bundleInfo
          .map((bundle) =>
            bundle.missingIngredients
              .filter((mi) => mi.deliverableInBundle)
              .map((i) => ({ ...i, nMissing: bundle.nMissing }))
          )
          .flat(),
        'name'
      ),
    [parsedGame]
  );
  return (
    <Pane flexDirection="column" width="100%">
      <CardTitle>Missing ingredients:</CardTitle>
      <hr color="#e6e6e6" />
      <Table>
        <Table.Body maxHeight={360}>
          {Object.keys(deliverables).map((key, i) => {
            const missingIngredientsName = deliverables[key];
            return (
              <Table.Row key={i}>
                <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
                  {key}
                </Table.TextCell>
                <Table.TextCell
                  textProps={{ fontSize: '1.1rem' }}
                  isNumber
                  flexBasis={40}
                  flexShrink={0}
                  flexGrow={0}
                >
                  {missingIngredientsName.reduce((p, c) => p + c.stack!, 0)}
                </Table.TextCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default MissingIngredientsCard;
