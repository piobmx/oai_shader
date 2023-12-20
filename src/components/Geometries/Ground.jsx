import { Grid } from "@react-three/drei";
const Ground = () => {
  const gridConfig = {
    cellSize: 1,
    cellThickness: 0.5,
    cellColor: "#cfcfcf",
    sectionSize: 2,
    sectionThickness: 2,
    sectionColor: "#ad4b4b",
    fadeDistance: 60,
    fadeStrength: 0,
    followCamera: false,
    infiniteGrid: false,
  };
  return <Grid position={[0, -0.0, 0]} args={[10, 10]} {...gridConfig} />;
};

export default Ground;
