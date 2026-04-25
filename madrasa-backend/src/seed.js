require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Student  = require('./models/Student');
const Donation = require('./models/Donation');
const Zakat    = require('./models/Zakat');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Student.deleteMany(), Donation.deleteMany(), Zakat.deleteMany()]);
  console.log('Cleared existing data');

  // Master admin user (cannot be deleted or modified by anyone)
  await User.create({ name: 'Admin', email: 'admin@madrasa.com', password: 'admin123', role: 'admin', isMaster: true });
  console.log('Master admin created — email: admin@madrasa.com | password: admin123');

  // Students
  await Student.insertMany([
    { name: 'Abdullah Ibn Umar',   class: 'Hifz Program',   guardian: 'Umar Farooq',       phone: '+880 1711 234567', fees: 1500, paid: 1500, status: 'Active'    },
    { name: 'Fatima Bint Ali',     class: 'Maktab Basic',   guardian: 'Ali Hassan',         phone: '+880 1822 987654', fees: 800,  paid: 400,  status: 'Active'    },
    { name: 'Zaid Al-Mahmud',      class: 'Alim (Year 1)',  guardian: 'Mahmudur Rahman',    phone: '+880 1933 555111', fees: 2000, paid: 2000, status: 'Active'    },
    { name: 'Maryam Khatun',       class: 'Hifz Program',   guardian: 'Karim Khatun',       phone: '+880 1644 321098', fees: 1500, paid: 750,  status: 'Active'    },
    { name: 'Ibrahim Al-Farsi',    class: 'Alim (Year 2)',  guardian: 'Hassan Al-Farsi',    phone: '+880 1755 112233', fees: 2200, paid: 2200, status: 'Active'    },
    { name: 'Yusuf Bin Khalid',    class: 'Hifz Program',   guardian: 'Khalid Hossain',     phone: '+880 1611 445566', fees: 1500, paid: 1500, status: 'Active'    },
    { name: 'Aisha Siddiqua',      class: 'Maktab Basic',   guardian: 'Siddiq Ahmed',       phone: '+880 1722 334455', fees: 800,  paid: 800,  status: 'Active'    },
    { name: 'Hamza Al-Ansari',     class: 'Alim (Year 1)',  guardian: 'Ansar Uddin',        phone: '+880 1833 667788', fees: 2000, paid: 1000, status: 'Active'    },
    { name: 'Ruqayyah Begum',      class: 'Hifz Program',   guardian: 'Rafiqul Islam',      phone: '+880 1944 778899', fees: 1500, paid: 1500, status: 'Active'    },
    { name: 'Usman Ghani',         class: 'Alim (Year 3)',  guardian: 'Ghani Miah',         phone: '+880 1555 889900', fees: 2500, paid: 2500, status: 'Active'    },
    { name: 'Khadija Akter',       class: 'Maktab Basic',   guardian: 'Akter Hossain',      phone: '+880 1666 990011', fees: 800,  paid: 400,  status: 'Active'    },
    { name: 'Ali Ibn Abi Talib',   class: 'Alim (Year 2)',  guardian: 'Abu Talib Miah',     phone: '+880 1777 001122', fees: 2200, paid: 2200, status: 'Active'    },
    { name: 'Sumayya Khanam',      class: 'Hifz Program',   guardian: 'Khanam Begum',       phone: '+880 1888 112233', fees: 1500, paid: 750,  status: 'Active'    },
    { name: 'Bilal Ibn Rabah',     class: 'Alim (Year 1)',  guardian: 'Rabah Uddin',        phone: '+880 1999 223344', fees: 2000, paid: 2000, status: 'Active'    },
    { name: 'Hafsa Bint Umar',     class: 'Maktab Basic',   guardian: 'Umar Faruq',         phone: '+880 1700 334455', fees: 800,  paid: 600,  status: 'Active'    },
    { name: 'Salman Al-Farisi',    class: 'Alim (Year 3)',  guardian: 'Farisi Rahman',      phone: '+880 1811 445566', fees: 2500, paid: 1250, status: 'Active'    },
    { name: 'Zainab Bint Jahsh',   class: 'Hifz Program',   guardian: 'Jahsh Miah',         phone: '+880 1922 556677', fees: 1500, paid: 1500, status: 'Inactive'  },
    { name: 'Muaz Ibn Jabal',      class: 'Alim (Year 2)',  guardian: 'Jabal Hossain',      phone: '+880 1533 667788', fees: 2200, paid: 2200, status: 'Active'    },
    { name: 'Asma Bint Bakr',      class: 'Maktab Basic',   guardian: 'Abu Bakr Siddiq',    phone: '+880 1644 778899', fees: 800,  paid: 0,    status: 'Active'    },
    { name: 'Talha Ibn Ubaydullah',class: 'Alim (Year 1)',  guardian: 'Ubaydullah Khan',    phone: '+880 1755 889900', fees: 2000, paid: 1000, status: 'Active'    },
  ]);
  console.log('Students seeded');

  // Donations
  await Donation.insertMany([
    { projectType: 'Madrasa Development', amount: 5000,  donorName: 'Ahmed Raza',        paymentMethod: 'bKash',  status: 'Completed', date: new Date('2024-10-24') },
    { projectType: 'Student Support',     amount: 1500,  donorName: 'Sarah Hussain',     paymentMethod: 'Card',   status: 'Completed', date: new Date('2024-10-23') },
    { projectType: 'Mosque Expansion',    amount: 10000, donorName: 'Tariq Jameel',      paymentMethod: 'Bank',   status: 'Completed', date: new Date('2024-10-22') },
    { projectType: 'Madrasa Development', amount: 2500,  donorName: 'Anonymous',         paymentMethod: 'Nagad',  status: 'Pending',   date: new Date('2024-10-21') },
    { projectType: 'Student Support',     amount: 500,   donorName: 'Fatima Begum',      paymentMethod: 'Cash',   status: 'Completed', date: new Date('2024-10-20') },
    { projectType: 'Mosque Expansion',    amount: 3000,  donorName: 'Mohammed Ali',      paymentMethod: 'bKash',  status: 'Completed', date: new Date('2024-10-19') },
    { projectType: 'Madrasa Development', amount: 7500,  donorName: 'Khalid Rahman',     paymentMethod: 'Bank',   status: 'Completed', date: new Date('2024-10-18') },
    { projectType: 'Student Support',     amount: 2000,  donorName: 'Nusrat Jahan',      paymentMethod: 'bKash',  status: 'Completed', date: new Date('2024-10-17') },
    { projectType: 'Mosque Expansion',    amount: 15000, donorName: 'Abdul Karim',       paymentMethod: 'Bank',   status: 'Completed', date: new Date('2024-10-16') },
    { projectType: 'Student Support',     amount: 1000,  donorName: 'Rashida Khanam',    paymentMethod: 'Nagad',  status: 'Pending',   date: new Date('2024-10-15') },
    { projectType: 'Madrasa Development', amount: 3500,  donorName: 'Hafizur Islam',     paymentMethod: 'Cash',   status: 'Completed', date: new Date('2024-10-14') },
    { projectType: 'Mosque Expansion',    amount: 5000,  donorName: 'Anonymous',         paymentMethod: 'bKash',  status: 'Completed', date: new Date('2024-10-13') },
    { projectType: 'Student Support',     amount: 750,   donorName: 'Sumaiya Akter',     paymentMethod: 'Card',   status: 'Completed', date: new Date('2024-10-12') },
    { projectType: 'Madrasa Development', amount: 12000, donorName: 'Mizanur Rahman',    paymentMethod: 'Bank',   status: 'Completed', date: new Date('2024-10-11') },
    { projectType: 'Mosque Expansion',    amount: 4500,  donorName: 'Taslima Begum',     paymentMethod: 'Nagad',  status: 'Pending',   date: new Date('2024-10-10') },
    { projectType: 'Student Support',     amount: 2500,  donorName: 'Shahidul Haque',    paymentMethod: 'bKash',  status: 'Completed', date: new Date('2024-10-09') },
    { projectType: 'Madrasa Development', amount: 6000,  donorName: 'Rokshana Parvin',   paymentMethod: 'Cash',   status: 'Completed', date: new Date('2024-10-08') },
    { projectType: 'Mosque Expansion',    amount: 8000,  donorName: 'Aminul Islam',      paymentMethod: 'Bank',   status: 'Completed', date: new Date('2024-10-07') },
    { projectType: 'Student Support',     amount: 1200,  donorName: 'Moriam Sultana',    paymentMethod: 'Card',   status: 'Completed', date: new Date('2024-10-06') },
    { projectType: 'Madrasa Development', amount: 9000,  donorName: 'Shafiqul Alam',     paymentMethod: 'bKash',  status: 'Completed', date: new Date('2024-10-05') },
  ]);
  console.log('Donations seeded');

  // Zakat
  await Zakat.insertMany([
    { donorName: 'Mohammed Al-Rashid', totalAmount: 2500,  allocationType: 'Student Sponsorship',       paymentMethod: 'Bank',  status: 'Verified', date: new Date('2024-10-20') },
    { donorName: 'Aisha Begum',        totalAmount: 750,   allocationType: 'General Fund',               paymentMethod: 'bKash', status: 'Pending',  date: new Date('2024-10-19') },
    { donorName: 'Ibrahim Hassan',     totalAmount: 1200,  allocationType: 'Madrasa Maintenance',        paymentMethod: 'Card',  status: 'Verified', date: new Date('2024-10-18') },
    { donorName: 'Khaleda Akter',      totalAmount: 3000,  allocationType: 'General Fund',               paymentMethod: 'Bank',  status: 'Verified', date: new Date('2024-10-17') },
    { donorName: 'Rafiqul Islam',      totalAmount: 500,   allocationType: 'Islamic Education Materials', paymentMethod: 'bKash', status: 'Pending',  date: new Date('2024-10-16') },
    { donorName: 'Nasrin Sultana',     totalAmount: 1800,  allocationType: 'Student Sponsorship',       paymentMethod: 'Nagad', status: 'Verified', date: new Date('2024-10-15') },
    { donorName: 'Anonymous',          totalAmount: 4500,  allocationType: 'General Fund',               paymentMethod: 'Cash',  status: 'Verified', date: new Date('2024-10-14') },
    { donorName: 'Shaheen Alam',       totalAmount: 900,   allocationType: 'Madrasa Maintenance',        paymentMethod: 'bKash', status: 'Pending',  date: new Date('2024-10-13') },
    { donorName: 'Farhana Yesmin',     totalAmount: 2200,  allocationType: 'Student Sponsorship',       paymentMethod: 'Bank',  status: 'Verified', date: new Date('2024-10-12') },
    { donorName: 'Nurul Huda',         totalAmount: 6000,  allocationType: 'General Fund',               paymentMethod: 'Bank',  status: 'Verified', date: new Date('2024-10-11') },
    { donorName: 'Tahmina Begum',      totalAmount: 1100,  allocationType: 'Islamic Education Materials', paymentMethod: 'Card',  status: 'Pending',  date: new Date('2024-10-10') },
    { donorName: 'Abul Kalam',         totalAmount: 3500,  allocationType: 'Madrasa Maintenance',        paymentMethod: 'bKash', status: 'Verified', date: new Date('2024-10-09') },
    { donorName: 'Shirin Akter',       totalAmount: 800,   allocationType: 'Student Sponsorship',       paymentMethod: 'Nagad', status: 'Verified', date: new Date('2024-10-08') },
    { donorName: 'Mozammel Haque',     totalAmount: 5000,  allocationType: 'General Fund',               paymentMethod: 'Bank',  status: 'Verified', date: new Date('2024-10-07') },
    { donorName: 'Dilruba Khanam',     totalAmount: 1500,  allocationType: 'Islamic Education Materials', paymentMethod: 'Cash',  status: 'Pending',  date: new Date('2024-10-06') },
    { donorName: 'Anisur Rahman',      totalAmount: 2800,  allocationType: 'Student Sponsorship',       paymentMethod: 'bKash', status: 'Verified', date: new Date('2024-10-05') },
    { donorName: 'Kohinoor Begum',     totalAmount: 700,   allocationType: 'Madrasa Maintenance',        paymentMethod: 'Card',  status: 'Pending',  date: new Date('2024-10-04') },
    { donorName: 'Mahbubur Rahman',    totalAmount: 4000,  allocationType: 'General Fund',               paymentMethod: 'Bank',  status: 'Verified', date: new Date('2024-10-03') },
    { donorName: 'Selina Parvin',      totalAmount: 1300,  allocationType: 'Student Sponsorship',       paymentMethod: 'Nagad', status: 'Verified', date: new Date('2024-10-02') },
    { donorName: 'Zahirul Islam',      totalAmount: 2100,  allocationType: 'Islamic Education Materials', paymentMethod: 'bKash', status: 'Pending',  date: new Date('2024-10-01') },
  ]);
  console.log('Zakat seeded');

  console.log('\n✅ Seed complete!');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
