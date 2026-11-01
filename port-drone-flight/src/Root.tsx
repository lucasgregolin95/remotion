import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { LogisticsParkShot, TruckYardShot } from "./LogisticsShots";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="TruckYard"
        component={TruckYardShot}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LogisticsPark"
        component={LogisticsParkShot}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
