/**
 * STREAMING_CHUNK:Configuring Express server dependencies...
 * Servidor Backend en Node.js y Express para Huellitas Felices
 * Este servidor se encarga de servir tu página web (index.html) 
 * y de recibir las reservas de tus clientes.
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos temporal en memoria (guarda las reservas mientras el servidor está encendido)
let bookingsDB = [];

// Ruta API para recibir las solicitudes de reserva desde el formulario
app.post('/api/bookings', (req, res) => {
    try {
        const { name, phone, petType, serviceType, startDate, endDate, notes } = req.body;
        
        if (!name || !phone || !serviceType) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
        }

        const newBooking = {
            id: Date.now().toString(),
            name,
            phone,
            petType: petType || 'Mascota',
            serviceType,
            startDate: startDate || 'Por definir',
            endDate: endDate || 'Por definir',
            notes: notes || '',
            createdAt: new Date().toISOString()
        };

        bookingsDB.push(newBooking);
        console.log('¡Nueva reserva recibida en el servidor!:', newBooking);

        return res.status(201).json({
            success: true,
            message: '¡Solicitud registrada con éxito!',
            booking: newBooking
        });
    } catch (error) {
        console.error('Error al procesar reserva:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// Ruta API para ver las reservas almacenadas (útil para administración)
app.get('/api/bookings', (req, res) => {
    res.json({ success: true, count: bookingsDB.length, bookings: bookingsDB });
});

// Servir tu archivo index.html principal cuando entren a la página web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`¡Servidor corriendo con éxito! Abre en tu navegador: http://localhost:${PORT}`);
});