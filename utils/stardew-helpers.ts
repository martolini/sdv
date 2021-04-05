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

export const sellingQuantifier = (quality: number = 0) => {
  switch (quality) {
    case 0:
      return 1;
    case 1:
      return 1.25;
    case 2:
      return 1.5;
    case 4:
      return 2;
    default:
      throw new Error(`Unknown quality: ${quality}`);
  }
};
