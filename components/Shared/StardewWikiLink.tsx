type StardewWikiLinkProps = {
  name: string;
};

const StardewWikiLink: React.FC<StardewWikiLinkProps> = ({ name }) => {
  return (
    <>
      {name && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit' }}
          href={encodeURI(
            `https://stardewvalleywiki.com/${name
              .trim()
              .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
              .replace(/ /g, '_')}`
          ).replace(/'/g, '%27')}
        >
          {name}
        </a>
      )}
    </>
  );
};

export default StardewWikiLink;
