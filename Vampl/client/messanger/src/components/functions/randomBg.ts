import genNumber from "./randomNumber";

const colors = ['yellow','green','blue','brown','black'];

const getRandomColor = () => {
  return colors[genNumber(0,colors.length - 1)]
}

export default getRandomColor;
