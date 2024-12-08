export const formValidators = {

    notEmptyValidator: {
        validate: (value:string) => {
            return value.trim().length > 0;
        },
        message: "The field cannot be empty"
    },
    notNoneTypeValidator: {
        validate: (value: number) => {
            return value > 0 && value <= 5;
        },
        message: "Please, select a rating"
    },
    notMoreThan500: {
        validate: (value:string) => {
            return value.trim().length <= 500;
        },
        message: "The field can not be longer than 500 characteres"
    },

}