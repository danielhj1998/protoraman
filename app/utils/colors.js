export const getColors = (isDarkMode) => {
  if(isDarkMode) {
    return darkColorScheme;
  } else {
    return lightColorScheme;
  }
};

const darkColorScheme = {
  background: "#34343A",
  body: "#E5E5E5",
  green: "#8EBF40",
  orange: "#D6725C",
  yellow: "#D6AE5B",
  gray: "#999999",
  placeholder: "#60606C",
  red: '#BA3E3E',
  cyan: '#40B6BF',
  blue: '#4084BF',
}

const lightColorScheme = {
  background: "#FFFFFF",
  body: "#34343A",
  green: "#568708",
  orange: "#B1523D",
  yellow: "#B18E3D",
  gray: "#828282",
  placeholder: "#E6E6E6",
  red: '#870808',
  cyan: '#088587',
  blue: '#085C87',
}
