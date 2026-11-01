import { Composition } from "remotion";
import { ZoomOutPatio } from "./ZoomOutPatio";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ZoomOutPatio"
        component={ZoomOutPatio}
        durationInFrames={660}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{ focoX: 0.47, focoY: 0.7, zoomInicial: 3 }}
      />
    </>
  );
};
