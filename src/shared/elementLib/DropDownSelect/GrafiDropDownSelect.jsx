import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./GrafiDropDownSelect.scss";

const GrafiDropDownSelect = (props) => (
  <FormControl sx={{ m: 1, minWidth: 80, margin: 0 }} size="small" fullWidth>
    <Select
      value={props.value}
      onChange={props.onChange}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      {...props}
    >
      <MenuItem disabled value="">
        <em>{props.placeholder}</em>
      </MenuItem>
      {props.menuItems.map((menuItem, id) => (
        // eslint-disable-next-line react/no-array-index-key
        <MenuItem key={id} value={menuItem.value} className="menuItem">
          {menuItem.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default GrafiDropDownSelect;
