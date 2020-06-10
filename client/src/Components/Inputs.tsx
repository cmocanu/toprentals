import React, { useCallback } from "react";
import { TextValidator } from "react-material-ui-form-validator";

const generateInput = (validators: string[], errorMessages: string[], isPassword?: boolean) => {
  const InputComponent = (props: {
    label: string;
    value: string | undefined;
    handleChange: (e: string) => void;
    disabled?: boolean;
  }) => {
    const { label, value, disabled, handleChange } = props;
    const onChange = useCallback((event: any) => {
      handleChange(event.target.value);
    }, []);
    return (
      <TextValidator
        label={label}
        onChange={onChange}
        name={label}
        value={value || ""}
        type={isPassword ? "password" : "text"}
        validators={validators}
        errorMessages={errorMessages}
        fullWidth={true}
        disabled={disabled}
      />
    );
  };
  return React.memo(InputComponent);
};

export const Text = generateInput(["required"], ["this field is required"]);
export const Number = generateInput(
  ["required", "isNumber", "isPositive"],
  ["this field is required", "must be a positive number", "must be a positive number"]
);
export const Latitude = generateInput(
  ["required", "isFloat", "maxNumber: 90", "minNumber: -90"],
  [
    "this field is required",
    "must be a decimal number",
    "must be between -90 and 90 degrees",
    "must be between -90 and 90 degrees",
  ]
);
export const Longitude = generateInput(
  ["required", "isFloat", "maxNumber: 180", "minNumber: -180"],
  [
    "this field is required",
    "must be a decimal number",
    "must be between -180 and 180 degrees",
    "must be between -180 and 180 degrees",
  ]
);
export const Email = generateInput(["required", "isEmail"], ["this field is required", "email is not valid"]);
export const Password = generateInput(["required"], ["password cannot be empty"], true);
export const OptionalPassword = generateInput([], [], true);
