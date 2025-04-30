const db = require('../config/db');
const { getDistanceFromLatLonInKm } = require('../utils/dist_cal');

// Add School data
exports.addSchool = async (req, res) => {
  
  try {
    const { name, address, latitude, longitude } = req.body;

    // Basic validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get List of Schools
exports.listSchools = async (req, res) => {
  // res.send("hlo")
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ error: "Latitude and Longitude are required and must be numbers" });
    }

    const [schools] = await db.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map((school) => {
      const distance = getDistanceFromLatLonInKm(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distanceInKm: distance.toFixed(2) };
    });

    schoolsWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm);

    res.json(schoolsWithDistance);
   

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
