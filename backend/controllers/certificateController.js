import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

// Save certificate after quiz completion
export const saveCertificate = async (req, res) => {
  try {
    const { title, subject, standard, score, correctAnswers, incorrectAnswers, totalQuestions, date } = req.body;
    const studentId = req.user.id;

    // Check if certificate already exists for this student + subject + standard
    const existing = await Certificate.findOne({ student: studentId, subject, standard });

    if (existing) {
      // Update with latest score
      existing.score = score;
      existing.correctAnswers = correctAnswers;
      existing.incorrectAnswers = incorrectAnswers;
      existing.totalQuestions = totalQuestions;
      existing.date = date;
      await existing.save();
      return res.json({ message: "Certificate updated", certificate: existing });
    }

    const cert = new Certificate({
      student: studentId,
      title,
      subject,
      standard,
      score,
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      date,
    });

    await cert.save();

    // Also save quiz score in user document
    await User.findByIdAndUpdate(studentId, {
      $push: {
        quizScores: { subject, standard, score, correctAnswers, incorrectAnswers, totalQuestions, date }
      }
    });

    res.status(201).json({ message: "Certificate saved", certificate: cert });
  } catch (err) {
    console.error("Certificate save error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all certificates for logged-in student
export const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all certificates (admin)
export const getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().populate("student", "name email standard").sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
