const Bus = require('../models/Bus');

exports.approveBus = async (req, res) => {
  try {
    const busId = req.params.busId;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Assuming you have a field in the bus model to represent the approval status
    bus.status = 'APPROVED';

    await bus.save();
    res.status(200).json({ message: 'Bus approved successfully' });
  } catch (err) {
    console.error('Error approving bus:', err);
    res.status(500).json({ error: 'Failed to approve bus' });
  }
};


// Bus rejection
exports.rejectBus = async (req, res) => {
  try {
    const busId = req.params.busId;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Assuming you have a field in the bus model to represent the rejection status
    bus.status = 'REJECTED';

    await bus.save();
    res.status(200).json({ message: 'Bus rejected successfully' });
  } catch (err) {
    console.error('Error rejecting bus:', err);
    res.status(500).json({ error: 'Failed to reject bus' });
  }
};

// Bus retrieval
exports.getBus = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    console.error('Error retrieving buses:', err);
    res.status(500).json({ error: 'Failed to retrieve buses' });
  }
};