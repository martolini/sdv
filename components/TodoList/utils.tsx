export const formatTag = (tag: string) => {
  const regexString = /\[\[[^\]\]]*\]\]/gim;
  const matches = [];
  let m;
  let output = tag;
  while ((m = regexString.exec(tag)) !== null) {
    if (m.index === regexString.lastIndex) {
      regexString.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match) => {
      const jsonMatch = JSON.parse(match.substr(2, match.length - 4));
      output = output.replace(
        match,
        `<a href="https://stardewvalleywiki.com${jsonMatch.href}" target="_blank">${jsonMatch.value}</a>`
      );
      matches.push({
        ...match,
      });
    });
  }
  return output;
};
