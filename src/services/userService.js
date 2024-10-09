const db = require("../config/mysql");

const addUser = (name, surname, email, password, passwordConfirm) => {
  
  if (!strongPass.test(password)) {
    return res.json({
      success: false,
      message: "Please enter a Strong Password",
    });
  }
  mysqlConnection.query(
    "SELECT email FROM investor WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.json({
          success: false,
          message: "Email already exists.",
        });
      } else if (password !== passwordConfirm) {
        return res.json({
          success: false,
          message: "Passwords do not match.",
        });
      } else {
        let hashedPassword = await bcrypt.hash(password, 8);

        mysqlConnection.query(
          "INSERT INTO investor SET ?",
          {
            name: name,
            surname: surname,
            email: email,
            password: hashedPassword,
          },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              return res.json({
                success: true,
                message: "Successfully registered.",
              });
              console.log(results);
            }
          }
        );
      }
    }
  );
};

module.exports = {
  addUser
};
