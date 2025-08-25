import { useState, useCallback } from "react";
import { validateForm } from "../utils/validation";

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValuesState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (name, value) => {
      setValuesState((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const validateField = useCallback(
    (name) => {
      if (validationRules[name]) {
        const fieldRules = validationRules[name];
        const value = values[name];

        for (let rule of fieldRules) {
          const error = rule(value);
          if (error) {
            setFieldError(name, error);
            return false;
          }
        }

        setFieldError(name, null);
        return true;
      }
      return true;
    },
    [values, validationRules, setFieldError]
  );

  const validateAllFields = useCallback(() => {
    const { errors: validationErrors, isValid } = validateForm(
      values,
      validationRules
    );
    setErrors(validationErrors);
    return isValid;
  }, [values, validationRules]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      setValue(name, newValue);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setFieldTouched(name, true);
      validateField(name);
    },
    [setFieldTouched, validateField]
  );

  const handleSubmit = useCallback(
    async (onSubmit) => {
      setIsSubmitting(true);

      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(touchedFields);

      const isValid = validateAllFields();

      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      }

      setIsSubmitting(false);
      return isValid;
    },
    [values, validateAllFields]
  );

  const reset = useCallback(
    (newInitialValues = initialValues) => {
      setValues(newInitialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  const setValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    setFieldError,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateAllFields,
    reset,
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
};
