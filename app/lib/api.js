// lib/api.js
import { getCurrentUserToken } from './cognito';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get authentication headers with Cognito JWT token
 */
async function getAuthHeaders() {
  try {
    const token = await getCurrentUserToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  } catch (err) {
    // Return headers without auth if user is not logged in
    return {
      'Content-Type': 'application/json',
    };
  }
}

// ============================================
// CLASSIFICATION API
// ============================================

/**
 * Classify a product
 * @param {string} productDescription - Description of the product
 * @param {string} countryOfOrigin - Country where product was made
 * @returns {Promise} Classification result
 */
export async function classifyProduct(productDescription, countryOfOrigin) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}/api/classify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      product_description: productDescription,
      country_of_origin: countryOfOrigin,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Classification failed');
  }

  return response.json();
}

// ============================================
// HISTORY API
// ============================================

/**
 * Get user's classification history
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @param {boolean} bookmarkedOnly - Only show bookmarked items
 * @returns {Promise} History data
 */
export async function getHistory(page = 1, limit = 20, search = '', bookmarkedOnly = false) {
  const headers = await getAuthHeaders();
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) params.append('search', search);
  if (bookmarkedOnly) params.append('bookmarked_only', 'true');
  
  const response = await fetch(`${API_URL}/api/history?${params}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch history');
  }

  return response.json();
}

/**
 * Get a specific classification by ID
 * @param {number} id - Classification ID
 * @returns {Promise} Classification data
 */
export async function getClassification(id) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}/api/history/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch classification');
  }

  return response.json();
}

/**
 * Update a classification (bookmark, notes)
 * @param {number} id - Classification ID
 * @param {object} updates - Updates to make
 * @returns {Promise} Updated classification
 */
export async function updateClassification(id, updates) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}/api/history/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update classification');
  }

  return response.json();
}

/**
 * Delete a classification
 * @param {number} id - Classification ID
 * @returns {Promise}
 */
export async function deleteClassification(id) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}/api/history/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete classification');
  }

  return response.json();
}

/**
 * Toggle bookmark on a classification
 * @param {number} id - Classification ID
 * @param {boolean} isBookmarked - New bookmark status
 * @returns {Promise}
 */
export async function toggleBookmark(id, isBookmarked) {
  return updateClassification(id, { is_bookmarked: isBookmarked });
}

/**
 * Add or update notes on a classification
 * @param {number} id - Classification ID
 * @param {string} notes - Notes text
 * @returns {Promise}
 */
export async function updateNotes(id, notes) {
  return updateClassification(id, { notes });
}

/**
 * Get user statistics
 * @returns {Promise} User stats
 */
export async function getUserStats() {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}/api/history/user/stats`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch stats');
  }

  return response.json();
}

// ============================================
// ERROR HANDLING HELPER
// ============================================

/**
 * Check if error is an authentication error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export function isAuthError(error) {
  return error.message.includes('unauthorized') || 
         error.message.includes('token') ||
         error.message.includes('authentication');
}