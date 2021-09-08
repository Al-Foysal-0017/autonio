import { Tooltip, withStyles } from "@material-ui/core";
import InfoIcon from "../../assets/img/icons/info.svg";

const StyledToolTip = withStyles({
  tooltip: {
    fontSize: 14,
    backgroundColor: "#2F3641",
    fontWeight: 400,
    lineHeight: "19.6px",
    padding: 10,
    letterSpacing: "0.5px",
  },
})(Tooltip);

const TooltipComponent = ({ title }) => (
  <StyledToolTip title={title} arrow>
    <div>
      <InfoIcon className="mr-3" />
    </div>
  </StyledToolTip>
);

export default TooltipComponent;
