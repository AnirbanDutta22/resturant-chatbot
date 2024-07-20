const chatbox = async (req, res) => {
  res.render("inbox", { title: "Chatbox" });
};

module.exports = chatbox;
