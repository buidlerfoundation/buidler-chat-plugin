import React from "react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const MuiBottomSheetTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default MuiBottomSheetTransition;
