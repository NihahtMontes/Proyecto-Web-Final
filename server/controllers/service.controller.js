const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, price, icon } = req.body;
    
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ message: 'Ya existe un servicio con ese nombre' });
    }

    const service = await Service.create({ name, description, price, icon });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el servicio', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error: error.message });
  }
};

module.exports = { getServices, createService, updateService, deleteService };