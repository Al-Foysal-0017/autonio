import DropdownIcon from "../../assets/img/icons/dropdown.svg";
import {
  FormControl as MFormControl,
  Select,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useState } from "react";
import styled from "styled-components";

const FormControl = styled(MFormControl)`
  margin-top: -2px !important;
  margin-bottom: -5px !important;
  & .MuiInputBase-root {
    color: ${({ theme }) => theme.color.textGrey};
    font-size: 12px;
  }

  & .MuiSvgIcon-root {
    color: ${({ theme }) => theme.color.textGrey};
  }

  & .MuiInput-underline:before,
  & .MuiInput-underline:after {
    border: none !important;
  }

  & .MuiSvgIcon-root {
    display: none;
  }
`;

const useStyles = makeStyles((theme) => ({
  menu: {
    "& .MuiPaper-root": {
      background: "#2F3641",
      padding: "4px 12px",
      "& li": {
        color: "#fff",
        fontSize: 14,
        fontWeight: 400,
        borderRadius: 4,
      },
      "& li.Mui-selected, & li:hover": {
        backgroundColor: "#030C163D",
      },
    },
  },
}));

const ArrowImage = styled.img`
  margin-left: -20px;
`;
const DropdownMenu = ({ menus, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <>
      {/* <Typography color="textGrey" size={12} onClick={() => setOpen(true)}>
        {menus[selected]}
        <img src={DropdownIcon} className="ml-2" />
      </Typography> */}
      <FormControl className="d-flex flex-direction-row">
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selected}
          onChange={handleChange}
          MenuProps={{ className: classes.menu }}
        >
          {menus.map((menu, index) => (
            <MenuItem value={index}>{menu}</MenuItem>
          ))}
        </Select>
        <ArrowImage src={DropdownIcon} />
      </FormControl>
    </>
  );
};

export default DropdownMenu;
