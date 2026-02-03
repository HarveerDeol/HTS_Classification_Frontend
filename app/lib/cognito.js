// lib/cognito.js
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails,
  CognitoUserAttribute 
} from 'amazon-cognito-identity-js';

// Configure your Cognito User Pool
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-2_gSmaQRhMf',
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '5t9v6eqlali1o07fn0hk1634j4',
};

const userPool = new CognitoUserPool(poolData);

// ============================================
// SIGN UP
// ============================================

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise} - Promise with user data
 */
export function signUp(email, password, name) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: 'name',
        Value: name,
      }),
    ];

    // Generate a unique username (use email prefix + random string)
    // This is needed because the pool is configured for email alias
    const username = `user_${email.split('@')[0]}_${Date.now()}`;

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        user: result.user,
        userConfirmed: result.userConfirmed,
        userSub: result.userSub,
        username: username, // Return the generated username
      });
    });
  });
}

// ============================================
// CONFIRM SIGN UP
// ============================================

/**
 * Confirm user registration with verification code
 * @param {string} usernameOrEmail - Username or email (will try email first as alias)
 * @param {string} code - Verification code from email
 * @returns {Promise}
 */
export function confirmSignUp(usernameOrEmail, code) {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: usernameOrEmail,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

// ============================================
// RESEND CONFIRMATION CODE
// ============================================

/**
 * Resend confirmation code
 * @param {string} username - Username (not email)
 * @returns {Promise}
 */
export function resendConfirmationCode(username) {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

// ============================================
// SIGN IN
// ============================================

/**
 * Sign in an existing user
 * Note: Since email is configured as an alias, users can sign in with their email
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Promise with tokens
 */
export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: email, // Email alias allows signing in with email
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({
          idToken: result.getIdToken().getJwtToken(),
          accessToken: result.getAccessToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
          user: cognitoUser,
        });
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // Handle new password required challenge if needed
        reject(new Error('New password required'));
      },
    });
  });
}

// ============================================
// SIGN OUT
// ============================================

/**
 * Sign out the current user
 */
export function signOut() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

// ============================================
// GET CURRENT USER
// ============================================

/**
 * Get the currently logged-in user
 * @returns {Promise} - Promise with user data
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        resolve(null);
        return;
      }

      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }

        const userData = {};
        attributes.forEach((attr) => {
          userData[attr.Name] = attr.Value;
        });

        resolve({
          username: cognitoUser.getUsername(),
          attributes: userData,
          session,
        });
      });
    });
  });
}

// ============================================
// GET CURRENT USER TOKEN
// ============================================

/**
 * Get the current user's ID token (JWT)
 * @returns {Promise<string>} - Promise with JWT token
 */
export function getCurrentUserToken() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error('No user logged in'));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        reject(new Error('Session expired'));
        return;
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
}

// ============================================
// FORGOT PASSWORD
// ============================================

/**
 * Initiate forgot password flow
 * @param {string} email - User's email
 * @returns {Promise}
 */
export function forgotPassword(email) {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

// ============================================
// CONFIRM PASSWORD RESET
// ============================================

/**
 * Confirm password reset with verification code
 * @param {string} email - User's email
 * @param {string} code - Verification code from email
 * @param {string} newPassword - New password
 * @returns {Promise}
 */
export function confirmPassword(email, code, newPassword) {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve('Password reset successful');
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

// ============================================
// CHANGE PASSWORD
// ============================================

/**
 * Change password for logged-in user
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise}
 */
export function changePassword(oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error('No user logged in'));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  });
}

// ============================================
// HELPER: Check if user is authenticated
// ============================================

/**
 * Check if a user is currently authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (err) {
    return false;
  }
}