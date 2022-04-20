const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatEducationInput (data)
{
    let errors = {};
    //Second video

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofStudy = !isEmpty(data.fieldofStudy) ? data.fieldofStudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    
   
    if (Validator.isEmpty(data.school)){
        errors.school = 'School field is required';
    }
  
    if (Validator.isEmpty(data.degree)){
        errors.degree = 'Degree field is required';
    }

    if (Validator.isEmpty(data.from)){
        errors.from = 'From date field is required';
    }

    
    if (Validator.isEmpty(data.fieldofStudy)){
        errors.fieldofStudy = 'Field of Study field is required';
    }


   
  
    return {
        errors,
        isValid: isEmpty(errors)
    }
};