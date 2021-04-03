import { Badge, StarIcon, Table } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';

export default function Bundles() {
  const { parsedGame } = useParsedGame();
  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>Room name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Bundle name</Table.TextHeaderCell>
        <Table.TextHeaderCell># of missing</Table.TextHeaderCell>
        <Table.TextHeaderCell>Missing</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {parsedGame &&
          parsedGame.bundleInfo
            .filter((b) => b.missingIngredients.length > 0)
            .map((bundle) => {
              return (
                <Table.Row key={bundle.id} isSelectable>
                  <Table.TextCell>{bundle.roomName}</Table.TextCell>
                  <Table.TextCell>{bundle.bundleName}</Table.TextCell>
                  <Table.TextCell isNumber>{bundle.nMissing}</Table.TextCell>
                  <Table.TextCell>
                    {bundle.missingIngredients
                      .filter((elem) => elem.name)
                      .map((elem) => (
                        <Badge
                          key={elem.itemId}
                          color="neutral"
                          marginRight={8}
                        >
                          {elem.name}
                          {elem.quality > 0 && (
                            <StarIcon
                              size={9}
                              color={elem.quality === 1 ? 'silver' : 'gold'}
                            />
                          )}
                          ({elem.stack})
                        </Badge>
                      ))}
                  </Table.TextCell>
                </Table.Row>
              );
            })}
      </Table.Body>
    </Table>
  );
}
