const loginPage = async (req, res) => {
  res.render("index", { title: "Login", errors: undefined });
};

module.exports = loginPage;
