require('dotenv').config();
const mongoose = require('mongoose');
const Donation = require('./models/Donation');

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Update old campaign names to new ones
  const updates = [
    { old: 'Mosque Expansion', new: 'Masjid and Madrasha Complex' },
    { old: 'Madrasa Development', new: 'An Nusrah Skill Development' },
    { old: 'Student Support', new: 'Poor Student Support' },
  ];

  for (const { old, new: newName } of updates) {
    const result = await Donation.updateMany(
      { projectType: old },
      { $set: { projectType: newName } }
    );
    console.log(`Updated ${result.modifiedCount} donations from "${old}" to "${newName}"`);
  }

  console.log('\n✅ Migration complete!');
  process.exit(0);
};

migrate().catch((err) => { console.error(err); process.exit(1); });
