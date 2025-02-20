import { SVGProps } from "react";
export * as Game from "./game";
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
