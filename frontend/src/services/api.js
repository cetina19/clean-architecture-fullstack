import { auth } from './firebaseConfig';
import router from '@/router'; 
const BASE_URL = "http://localhost:3001/api/frontend_parameters"; 

const PREDEFINED_API_TOKEN = process.env.VUE_APP_PREDEFINED_API_TOKEN;

async function apiFetch(endpoint = '', options = {}, retry = true) {
  const method = options.method ? options.method.toUpperCase() : 'GET';

  let token = '';

  if (method !== 'GET') {
    if (auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken(true);
        localStorage.setItem("authToken", token);
      } catch (error) {
        console.error("Error getting ID token:", error);
        router.push('/signin');
        throw new Error("Authentication error. Please log in again.");
      }
    } else {
      router.push('/signin');
      throw new Error("No authenticated user. Please log in.");
    }
  } else {
    token = PREDEFINED_API_TOKEN;

    if (!token) {
      console.warn("Predefined API token is not set.");
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = endpoint ? `${BASE_URL}${endpoint}` : BASE_URL;

  try {
    const response = await fetch(url, {
      ...options,
      method, 
      headers,
    });

    if (response.status === 401 && retry && method === 'PUT') {
      console.warn("Token expired. Attempting to refresh and retry the request.");

      try {
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken(true);
          localStorage.setItem("authToken", token);

          headers.Authorization = `Bearer ${token}`;

          const retryResponse = await fetch(url, {
            ...options,
            method, 
            headers,
          });

          
          if (retryResponse.status === 401) {
            router.push('/signin'); 
            throw new Error("Unauthorized. Please log in again.");
          }

          return await processResponse(retryResponse);
        } else {
          router.push('/signin'); 
          throw new Error("No authenticated user. Please log in.");
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        router.push('/signin');
        throw new Error("Session expired. Please log in again.");
      }
    }

    return await processResponse(response);
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error; 
  }
}


async function processResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (err) {
      throw new Error(errorMessage);
    }
    
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("Content-Type") || response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export { apiFetch };
