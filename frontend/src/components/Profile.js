import React from "react";

const Profile = ({ user }) => {
  // Use the user prop directly, which will be passed from the App component
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-lg text-gray-700 font-semibold">
            No user data found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          User Profile
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">First Name: </strong>
              {user.FName}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">Last Name: </strong>
              {user.LName}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">Email: </strong>
              {user.Email}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">Phone: </strong>
              {user.Mobile}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
