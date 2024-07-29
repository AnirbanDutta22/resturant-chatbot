const chatbox = async (req, res) => {
  const username = req.user.name;
  console.log(req.user.name);
  res.render("inbox", { data: username, errors: undefined });
};

module.exports = chatbox;
