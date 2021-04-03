import { Badge, StarIcon, Table } from 'evergreen-ui';
import { Bundle } from 'typings/stardew';

type BundlesTableProps = {
  bundleInfo: Bundle[];
};

export default function BundlesTable({ bundleInfo }: BundlesTableProps) {
  return (
    <Table width="100%">
      <Table.Head>
        <Table.TextHeaderCell>Room name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Bundle name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Reward</Table.TextHeaderCell>
        <Table.TextHeaderCell># of missing</Table.TextHeaderCell>
        <Table.TextHeaderCell flexBasis={560}>Missing</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={520}>
        {bundleInfo &&
          bundleInfo
            .filter((b) => b.missingIngredients.length > 0 && b.id !== '36')
            .map((bundle) => {
              return (
                <Table.Row key={bundle.id} isSelectable>
                  <Table.TextCell>{bundle.roomName}</Table.TextCell>
                  <Table.TextCell>{bundle.bundleName}</Table.TextCell>
                  <Table.TextCell>
                    {bundle.reward.name} ({bundle.reward.stack})
                  </Table.TextCell>
                  <Table.TextCell isNumber>{bundle.nMissing}</Table.TextCell>
                  <Table.TextCell flexBasis={560} overflowY="auto">
                    {bundle.missingIngredients
                      .filter((elem) => elem.name)
                      .map((elem) => (
                        <Badge
                          key={elem.itemId}
                          color={elem.deliverableInBundle ? 'green' : 'neutral'}
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
