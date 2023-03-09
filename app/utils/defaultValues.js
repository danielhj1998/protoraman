export const defaultSpectrumSettings = (colors) => {
  return {
    spectrumColor: colors.orange,
    graphColor: colors.background,
    gridEnabled: true,
    gridTicks: 1,
    tickStep: {
      x: 200,
      y: 0.1,
    },
    viewRange: {
      x: [0, 2600],
      y: [0, 1],
    },
  }
};
