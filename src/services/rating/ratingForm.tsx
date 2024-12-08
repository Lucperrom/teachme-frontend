import { formValidators } from "./formValidators";

export const ratingForm = [
  {
    tag: "Rating",
    name: "rating",
    type: "number",
    defaultValue: 0,
    isRequired: true,
    validators: [formValidators.notNoneTypeValidator],
  },
  {
    tag: "Description",
    name: "description",
    type: "text",
    defaultValue: "",
    isRequired: true,
    validators: [formValidators.notEmptyValidator, formValidators.notMoreThan500],
  }

];