
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Sets the custom claim 'role' on a user to 'admin'
 * @param {object} data The data passed to the function, expecting {uid: string}
 * @param {object} context The context of the function call, including auth information.
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an admin.
  if (context.auth.token.role !== 'admin') {
    return { error: "Only admins can set other users as admins." };
  }

  const { uid } = data;
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    return { message: `Success! User ${uid} has been made an admin.` };
  } catch (error) {
    return { error: error.message };
  }
});

/**
 * Sets a specific role on a user.
 * @param {object} data The data passed to the function, expecting {uid: string, role: string}
 * @param {object} context The context of the function call.
 */
exports.setUserRole = functions.https.onCall(async (data, context) => {
    // Check if the request is made by an admin.
    if (context.auth.token.role !== 'admin') {
        return { error: 'Only admins can change user roles.' };
    }

    const { uid, role } = data;

    // Basic validation for the role.
    const allowedRoles = ['admin', 'client', 'barbershop_owner'];
    if (!allowedRoles.includes(role)) {
        return { error: `Invalid role. Please use one of: ${allowedRoles.join(', ')}` };
    }

    try {
        await admin.auth().setCustomUserClaims(uid, { role: role });
        return { message: `Success! User ${uid} has been given the role: ${role}.` };
    } catch (error) {
        return { error: error.message };
    }
});

// This function will automatically assign a 'client' role to any new user that signs up.
exports.assignDefaultRole = functions.auth.user().onCreate(async (user) => {
    try {
        await admin.auth().setCustomUserClaims(user.uid, { role: 'client' });
        console.log(`Assigned 'client' role to new user: ${user.uid}`);

        // Also, create a user document in Firestore.
        const userRef = admin.firestore().collection('users').doc(user.uid);
        return userRef.set({
            email: user.email,
            role: 'client',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    } catch (error) {
        console.error('Failed to assign default role and create user doc:', error);
    }
});
