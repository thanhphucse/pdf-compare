// Axios setup for API requests
import axios from 'axios';

const comparePDFs = async (formData) => {
    const response = await axios.post('/api/compare/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.differences;
};

export { comparePDFs };
