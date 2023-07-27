const { check, validationResult } = require("express-validator");

function applicantValidation(req, res, next) {
  const validationChecks = [
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only alphabetic characters'),

  check('lastName')
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only alphabetic characters'),
  
  check("Email")
      .notEmpty().withMessage("Conatct Email is required")
      .isEmail().withMessage("Invalid email format"),
  
  check("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*]/)
      .withMessage('Password must contain at least one special character'),
  
//   check('confirmPassword')
//       .notEmpty().withMessage('Confirm Password is required')
//       .custom((value, { req }) => {
//         if (value !== req.body.password) {
//           throw new Error('Passwords do not match');
//         }
//         return true;
//       }),
  ];

  // Run the validation checks
  Promise.all(validationChecks.map((checkFn) => checkFn.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Extract the error messages
        const errorMessages = errors.array().map((error) => error.msg);
        // Return the error messages
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    })
    .catch((error) => {
      // Handle error if any of the validation checks fail
      next(error);
    });
}

module.exports = applicantValidation