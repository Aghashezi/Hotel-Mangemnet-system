// // Import dependencies
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');

// // Create the Express app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Serve the static files from the "frontend" directory
// app.use(express.static(__dirname + '/frontend'));

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://muhammadshahzadlx9:asdfgh123@cluster0.j35khkl.mongodb.net/Hotel', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.connection.once('open', () => {
//   console.log('Database Connected');
// });
// mongoose.connection.on('error', (err) => {
//   console.log(err);
// });

// // Create a schema for the data
// const bookingSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique : true
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//   },
//   checkInDate: {
//     type: Date,
//     required: true,
//   },
//   checkOutDate: {
//     type: Date,
//     required: true,
//   },
//   guests: {
//     type: Number,
//     required: true,
//   },
//   roomType: {
//     type: String,
//     required: true,
//   },
//   specialRequests: {
//     type: String,
//     required: false,
//   },
// });

// // Create a model based on the schema
// const Booking = mongoose.model('Booking', bookingSchema);

// // Middleware to parse incoming request bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.get('/Hotel/bookings', async (req, res) => {
//   try {
//     // Retrieve all bookings from the database
//     const bookings = await Booking.find({});
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// app.get('/Hotel/bookings/:email', async (req, res) => {
//   try {
//     // Retrieve bookings by email
//     const bookings = await Booking.find({ email: req.params.email });
//     if (bookings.length === 0) {
//       res.status(404).send('No bookings found for the email');
//     } else {
//       res.json(bookings);
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// app.post('/Hotel/bookings', async (req, res) => {
//   try {
//     // Check if all required fields are present
//     const requiredFields = ['name', 'email', 'phoneNumber', 'checkInDate', 'checkOutDate', 'guests', 'roomType'];
//     const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

//     if (missingFields.length > 0) {
//       return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
//     }

//     // Create a new booking
//     const newBooking = new Booking({
//       name: req.body.name,
//       email: req.body.email,
//       phoneNumber: req.body.phoneNumber,
//       checkInDate: req.body.checkInDate,
//       checkOutDate: req.body.checkOutDate,
//       guests: req.body.guests,
//       roomType: req.body.roomType,
//       specialRequests: req.body.specialRequests,
//     });

//     const savedBooking = await newBooking.save();
//     res.json(savedBooking);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });


// app.put('/Hotel/bookings/:email', async (req, res) => {
//   try {
//     // Update a booking by email
//     const updatedBooking = await Booking.findOneAndUpdate(
//       { email: req.params.email },
//       {
//         name: req.body.name,
//         email: req.body.email,
//         phoneNumber: req.body.phoneNumber,
//         checkInDate: req.body.checkInDate,
//         checkOutDate: req.body.checkOutDate,
//         guests: req.body.guests,
//         roomType: req.body.roomType,
//         specialRequests: req.body.specialRequests,
//       },
//       { new: true }
//     );

//     if (!updatedBooking) {
//       res.status(404).send('No bookings found for the email');
//     } else {
//       res.json(updatedBooking);
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// app.delete('/Hotel/bookings/:email', async (req, res) => {
//   try {
//     // Delete a booking by email
//     const deletedBooking = await Booking.findOneAndDelete({ email: req.params.email });

//     if (!deletedBooking) {
//       res.status(404).send('No bookings found for the email');
//     } else {
//       res.sendStatus(204);
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/frontend'));

mongoose.connect('mongodb+srv://muhammadshahzadlx9:asdfgh123@cluster0.j35khkl.mongodb.net/Hotel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Database Connected');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  specialRequests: {
    type: String,
    required: false,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(500).send({ error: 'Error during signup.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: 'Login successful!' });
    } else {
      res.status(401).send({ error: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error during login.' });
  }
});

app.get('/Hotel/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/Hotel/bookings/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email });
    if (bookings.length === 0) {
      res.status(404).send('No bookings found for the email');
    } else {
      res.json(bookings);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/Hotel/bookings', async (req, res) => {
    try {
      // Check if all required fields are present
      const requiredFields = ['name', 'email', 'phoneNumber', 'checkInDate', 'checkOutDate', 'guests', 'roomType'];
      const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));
  
      if (missingFields.length > 0) {
        return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
      }
    const newBooking = new Booking({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      guests: req.body.guests,
      roomType: req.body.roomType,
      specialRequests: req.body.specialRequests,
    });
    const savedBooking = await newBooking.save();
    res.json(savedBooking);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.put('/Hotel/bookings/:email', async (req, res) => {
  try {
    const updatedBooking = await Booking.findOneAndUpdate(
      { email: req.params.email },
      {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        guests: req.body.guests,
        roomType: req.body.roomType,
        specialRequests: req.body.specialRequests,
      },
      { new: true }
    );

    if (!updatedBooking) {
      res.status(404).send('No bookings found for the email');
    } else {
      res.json(updatedBooking);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/Hotel/bookings/:email', async (req, res) => {
  try {
    const deletedBooking = await Booking.findOneAndDelete({ email: req.params.email });

    if (!deletedBooking) {
      res.status(404).send('No bookings found for the email');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});