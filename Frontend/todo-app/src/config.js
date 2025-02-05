export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const MCQ_SERVICE_URL = import.meta.env.VITE_MCQ_SERVICE_URL || 'http://localhost:8000';

// You can add other configuration variables here
export const endpoints = {
    adminLogin: `${API_URL}/admin/login`,
    adminSignup: `${API_URL}/admin/signup`,
    adminCourses: `${API_URL}/admin/courses`,
    adminMe: `${API_URL}/admin/me`,
    userLogin: `${API_URL}/users/login`,
    userSignup: `${API_URL}/users/signup`,
    userCourses: `${API_URL}/users/courses`,
    userPurchasedCourses: `${API_URL}/users/purchasedCourse`,
    mcqUpload: `${MCQ_SERVICE_URL}/upload`
}; 