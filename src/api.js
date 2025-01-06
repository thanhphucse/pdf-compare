import axios from 'axios';
export const API_BASE_URL = "http://127.0.0.1:8000"; 
// export const API_BASE_URL = "https://pdf-compare-859207632040.us-central1.run.app"; 

export const getProjects = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/projects/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createProject = async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/projects/`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getDocuments = async (projectId, token) => {
    const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/documents/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const compareImage = async (file1, file2) => {
  const formData = new FormData();
  formData.append("file1", file1);
  formData.append("file2", file2);

  try {
    const response = await fetch(`${API_BASE_URL}/api/compare-images/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      if(response.error)
        throw new Error(response.error);
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const comparePdf = async (file1, file2) => {
  const formData = new FormData();
  formData.append("file1", file1);
  formData.append("file2", file2);

  try {
    const response = await fetch(`${API_BASE_URL}/api/compare-pdfs/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      if(response.error)
        throw new Error(response.error);
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    // console.error(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};