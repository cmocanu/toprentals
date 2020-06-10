import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Filter } from "../Backend/Types";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500,
    marginLeft: 24,
    marginRight: 24,
  },
});

export function LocalFilterComponent(props: {
  filter: Filter;
  setFilter: any;
  maxVal: number;
  unit: string;
  name: string;
  step: number;
}) {
  const classes = useStyles();
  const { filter, setFilter, maxVal, unit, name, step } = props;
  const value = [filter.min, filter.max];

  const valuetext = (value: number) => {
    return `${value} ${unit}`;
  };

  const marks = [
    {
      value: filter.min,
      label: valuetext(filter.min),
    },
    {
      value: filter.max,
      label: valuetext(filter.max),
    },
  ];

  const handleChange = (_event: any, newValue: number | number[]) => {
    const v = newValue as number[];
    setFilter({ min: v[0], max: v[1] });
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" align="center" gutterBottom>
        {name}
      </Typography>
      <Slider
        value={value}
        min={0}
        max={maxVal}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        marks={marks}
        step={step}
      />
    </div>
  );
}
export const FilterComponent = React.memo(LocalFilterComponent);
