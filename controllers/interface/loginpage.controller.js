const loginPage = async (req, res) => {
  res.render("index", { title: "Login" });
};

module.exports = loginPage;
