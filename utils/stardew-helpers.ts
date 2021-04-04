export const qualityToColor = (quality) => {
  switch (quality) {
    case 1:
      return 'silver';
    case 2:
      return 'gold';
    case 4:
      return 'purple';
    default:
      throw new Error(`${quality} not found`);
  }
};
