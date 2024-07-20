const registerPage = async (req, res) => {
  res.render("register", { title: "Register" });
};

module.exports = registerPage;
