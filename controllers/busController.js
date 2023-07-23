    // const Bus = require('../models/Bus');
    const Bus = require('../models/Bus');
    const Ticket = require('../models/Ticket');
    const multer = require('multer');
    // Bus submission
  
    // Bus retrieval
    // const Bus = require('../models/Bus');

    // Home page controller


// Bus submission
exports.submitBus = async (req, res) => {
    try {
      // Get the form data from the request body
      const { name, company, busNumber, email, phoneNumber, totalSeats, route, originAddress, destinationAddress, date, busType } = req.body;
      const panCardImage = req.file.path;
  
      // Create a new Bus object with the form data
      const newBus = new Bus({
        owner: req.user._id, // Assuming user is authenticated and req.user contains user data
        name,
        company,
        busNumber,
        email,
        phoneNumber,
        totalSeats,
        route,
        originAddress,
        destinationAddress,
        date,
        busType,
        panCardImage,
        status: 'Pending' // Set the initial status to 'Pending'
      });
  
      // Save the new bus object to the database
      await newBus.save();
  
      // Redirect to the bus owner's dashboard or a success page
      res.status(201).json({ message: 'Bus submitted successfully', bus: newBus });

    } catch (err) {
        console.error('Error submitting bus:', err);
        // Send a JSON response with status code 500 (Internal Server Error) and error message
        res.status(500).json({ error: 'Failed to submit the bus' });
    }
  };


    // Handle bus search form submission
    exports.searchBuses = async (req, res) => {
        try {
        const { originAddress, destinationAddress, date } = req.body;
        
        // Implement logic to search for available buses based on the user's search criteria
        // You can query the database to find buses that match the origin address, destination address, and date
        const buses = await Bus.find({ 
            originAddress: { $regex: originAddress, $options: 'i' }, // Case-insensitive search for origin address
            destinationAddress: { $regex: destinationAddress, $options: 'i' }, // Case-insensitive search for destination address
            // Additional conditions for date if applicable

            date: { $eq: new Date(date) }
        });
    
        // Render the search results in a view
        res.status(200).json({ buses });
        } catch (err) {
            console.error('Error searching for buses:', err);
            res.status(500).json({ error: 'Failed to search for buses' });
        }
    };
    // Handle ticket submission
    exports.submitTicket = async (req, res) => {
        try {
        const { busId, numberOfSeats } = req.body;
        
        // Find the selected bus
            const bus = await Bus.findById(busId);
    
        if (!bus) {
            return res.status(404).send('Bus not found.');
        }
    
        // Check if the requested number of seats is available
        if (numberOfSeats > bus.availableSeats) {
            return res.status(400).send('Not enough seats available.');
        }
    
        // Calculate the total price for the ticket
        const totalPrice = bus.ticketPrice * numberOfSeats;
    
        // Create a new ticket entry
        const ticket = new Ticket({
            user: req.user._id, // Assuming user is authenticated and req.user contains user data
            bus: bus._id,
            numberOfSeats,
            totalPrice
        });
    
        // Save the ticket and update available seats in the bus
        await ticket.save();
        bus.availableSeats -= numberOfSeats;
        await bus.save();
    
        return res.send('Ticket submitted successfully.');
        } catch (err) {
        console.error('Error submitting ticket:', err);
        res.status(500).send('An error occurred while processing the ticket submission.');
        }
    };
    
    // Handle ticket booking
    exports.bookTicket = async (req, res) => {
        try {
        const { ticketId } = req.params;
    
        // Find the ticket by its ID
        const ticket = await Ticket.findById(ticketId);
    
        if (!ticket) {
            return res.status(404).send('Ticket not found.');
        }
    
        // Perform any additional checks or business logic related to ticket booking here
        // For example, you can implement payment processing, email notifications, etc.
    
        // Update ticket status to "booked" if everything is successful
        ticket.status = 'booked';
        await ticket.save();
    
        return res.send('Ticket booked successfully.');
        } catch (err) {
        console.error('Error booking ticket:', err);
        res.status(500).send('An error occurred while processing the ticket booking.');
        }
    };





   // Home page with recently added buses
exports.homePage = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query, default to 1
      const perPage = 5; // Number of buses to display per page
  
      // Fetch recently added buses with pagination
      const totalCount = await Bus.countDocuments(); // Total count of buses
      const totalPages = Math.ceil(totalCount / perPage); // Calculate total number of pages
      const skip = (page - 1) * perPage; // Calculate the number of buses to skip
  
      const recentlyAddedBuses = await Bus.find()
        .sort('-createdAt')
        .skip(skip)
        .limit(perPage);
  
      res.status(200).json({ recentlyAddedBuses, totalPages, currentPage: page });
    } catch (err) {
      console.error('Error retrieving recently added buses:', err);
      res.status(500).json({ error: 'Failed to retrieve recently added buses' });
    }
  };




//  yadi ac non ac ko adhar ma chaiyo vanya 




// Function to search buses by type (AC or Non-AC)
exports.searchBusesByType = async (busType) => {
  try {
    // Build the query object based on the provided busType
    const query = {};
    if (busType === 'AC' || busType === 'Non-AC') {
      query.busType = busType;
    } else {
      throw new Error('Invalid bus type. Must be either "AC" or "Non-AC".');
    }

    // Implement logic to search for available buses based on the bus type
    // You can query the database to find buses that match the specified type
    const buses = await Bus.find(query);

    return buses;
  } catch (err) {
    console.error('Error searching for buses by type:', err);
    throw err;
  }
};