import path from 'path'

export const startAttendance = async (req, res) => {
    const { subject } = req.body;

    if (!subject) {
        return res.status(400).json({ message: 'Subject is required!' });
    }

    try {
        // Using fetch instead of axios to call Flask API
        const response = await fetch('http://localhost:5001/start-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If response status is not OK, return an error message
            return res.status(response.status).json({ message: data.message || 'Error communicating with Python API' });
        }

        res.json(data);  // Send the successful response data from Flask back to the frontend
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error communicating with Flask API' });
    }
};
export const downloadExcel = async (req, res) => {
    try {
        const { subject } = req.query; // Retrieve subject name from query parameter

        if (!subject) {
            return res.status(400).send('Subject name is required.');
        }

        const sanitizedSubject = subject.replace(/[^a-zA-Z0-9_\- ]/g, '_'); // Allow spaces in filename
        const filePath = path.join(__dirname, 'AttendanceSystem', `${sanitizedSubject}.xlsx`); // Use sanitized subject in file path

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).send(`File for subject '${sanitizedSubject}' not found.`);
        }

        res.download(filePath, `${sanitizedSubject}.xlsx`, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Could not download the file.');
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('An unexpected error occurred.');
    }
};

