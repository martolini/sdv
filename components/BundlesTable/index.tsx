import {
  Pane,
  StarIcon,
  Text,
  Table,
  TextTableCellProps,
  TextTableHeaderCellProps,
  useTheme,
  TextProps,
} from 'evergreen-ui';
import { useMemo } from 'react';
import { Bundle } from 'typings/stardew';
import { qualityToColor } from 'utils/stardew-helpers';

type BundlesTableProps = {
  bundleInfo: Bundle[];
};

const CustomTextCell: React.FC<TextTableCellProps> = ({
  children,
  ...props
}) => (
  <Table.TextCell
    textProps={{ fontSize: '1rem', letterSpacing: '0.3px' }}
    {...props}
  >
    {children}
  </Table.TextCell>
);

const CustomHeaderCell: React.FC<TextTableHeaderCellProps> = ({
  children,
  ...props
}) => (
  <Table.TextHeaderCell textProps={{ fontSize: '1rem' }} {...props}>
    {children}
  </Table.TextHeaderCell>
);

const StardewWikiLink = (name) => {
  return name ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit' }}
      href={encodeURI(
        `https://stardewvalleywiki.com/${name
          .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
          .replace(/ /g, '_')}`
      ).replace(/'/g, '%27')}
    >
      {name}
    </a>
  ) : (
    name
  );
};

export default function BundlesTable({ bundleInfo }: BundlesTableProps) {
  const theme = useTheme();
  const extraGreenProps: Partial<TextProps> = useMemo(
    () => ({
      backgroundColor: theme.palette.green.light,
      color: theme.palette.green.dark,
    }),
    [theme]
  );
  return (
    <Table width="100%">
      <Table.Head>
        <CustomHeaderCell>Room name</CustomHeaderCell>
        <CustomHeaderCell>Bundle name</CustomHeaderCell>
        <CustomHeaderCell>Reward</CustomHeaderCell>
        <CustomHeaderCell># of missing</CustomHeaderCell>
        <CustomHeaderCell flexBasis={580}>Missing</CustomHeaderCell>
      </Table.Head>
      <Table.Body height={520}>
        {bundleInfo &&
          bundleInfo
            .filter((b) => b.missingIngredients.length > 0 && b.id !== '36')
            .map((bundle) => {
              return (
                <Table.Row
                  key={bundle.id}
                  marginY={5}
                  height="auto"
                  padding={5}
                  minHeight={31}
                >
                  <CustomTextCell>{bundle.roomName}</CustomTextCell>
                  <CustomTextCell>{bundle.bundleName}</CustomTextCell>
                  <CustomTextCell>
                    {StardewWikiLink(bundle.reward.name)} ({bundle.reward.stack}
                    )
                  </CustomTextCell>
                  <CustomTextCell isNumber>{bundle.nMissing}</CustomTextCell>
                  <CustomTextCell flexBasis={580}>
                    <Pane display="flex" flexWrap="wrap">
                      {bundle.missingIngredients
                        .filter((e) => e.name)
                        .sort(
                          (a, b) =>
                            +b.deliverableInBundle - +a.deliverableInBundle
                        )
                        .map((elem) => (
                          <Text
                            size={500}
                            key={elem.itemId}
                            marginX={5}
                            marginY={2}
                            paddingX={8}
                            paddingY={2}
                            backgroundColor={theme.scales.neutral.N3}
                            borderRadius={6}
                            {...(elem.deliverableInBundle
                              ? extraGreenProps
                              : {})}
                          >
                            {StardewWikiLink(elem.name)}({elem.stack}
                            {elem.quality > 0 && (
                              <StarIcon
                                size={10}
                                color={qualityToColor(elem.quality)}
                              />
                            )}
                            )
                          </Text>
                        ))}
                    </Pane>
                  </CustomTextCell>
                </Table.Row>
              );
            })}
      </Table.Body>
    </Table>
  );
}
