const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Send back the file path after successful upload
    res.status(201).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile };
