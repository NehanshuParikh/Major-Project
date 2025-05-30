import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout';
import ProfileContext from '../../Context/ProfileContext';
import toast from 'react-hot-toast';

const EditProfileForm = () => {
    const { profileData, loading } = useContext(ProfileContext);

    const [formData, setFormData] = useState({
        email: '',
        userId: '',
        fullName: '',
        profilePhoto: null,
        fathersName: '',
        mothersName: '',
        fathersEmail: '',
        mothersEmail: '',
    });

    useEffect(() => {
        // Populate formData with profileData once it's available
        if (profileData) {
            setFormData({
                email: profileData.email || '',
                userId: profileData.userId || '',
                fullName: profileData.fullName || '',
                mobile: profileData.mobileNumber || '',
                profilePhoto: profileData.profilePhoto || null, // Display current photo if available
                fathersName: profileData.parentsInfo?.fathersName || '',
                mothersName: profileData.parentsInfo?.mothersName || '',
                fathersEmail: profileData.parentsInfo?.fathersEmail || '',
                mothersEmail: profileData.parentsInfo?.mothersEmail || '',
            });      
        }
    }, [profileData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handlePhotoUpload = (e) => {
    //     setFormData({ ...formData, profilePhoto: e.target.files[0] });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        const response = await fetch('http://localhost:5000/api/user/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData), // Ensure you're sending the form data
        });

        // Parse the JSON response
        const data = await response.json();

        if (data.success) {
            console.log('Data Updated');
            toast.success('Profile Updated')
        } else {
            console.log('Data Failed to Update');
            toast.error('Profile Not Updated. Try Again Later')

        }
    };

    // If data is still loading
    if (loading) {
        return (
            <DashboardLayout>
                <div>Loading...</div>
            </DashboardLayout>
        );
    }

    // If profileData is unavailable
    if (!profileData) {
        return (
            <DashboardLayout>
                <div className='text-black dark:text-white'>Profile data not available</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center bg-gray-100 dark:bg-[#1A222C]">
                <form
                    onSubmit={handleSubmit}
                    className="w-full my-12 mx-2 max-w-lg bg-white dark:bg-gray-800 dark:text-white p-8 rounded-lg shadow-lg"
                >
                    <h2 className='text-xl font-semi-bold mb-4'>User Profile:</h2>
                    {/* Profile Photo */}
                    <div className="flex justify-center items-center mb-6 flex-col gap-2">
                        <label htmlFor="profilePhoto" className="cursor-pointer">
                            <div className="w-32 h-32 overflow-hidden border-4 border-gray-200 dark:border-gray-800">
                                <img
                                    src={formData.profilePhoto}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </label>
                        <p className='text-red-500 dark:text-red-400 text-sm text-justify'>NOTE: This photo is used for attendance. Contact HOD/Admin for changing the photo. Inform higher authorities if any details are updated here to avoid incorrect records.</p>
                    </div>
                    {/* the below profile photo is with changing the profile pic so if we want to change the profile pic then uncomment below code */}
                    {/* Profile Photo */}
                    {/* <div className="flex justify-center mb-6">
            <label htmlFor="profilePhoto" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                {formData.profilePhoto ? (
                  <img
                    src={typeof formData.profilePhoto === 'string' ? formData.profilePhoto : URL.createObjectURL(formData.profilePhoto)}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Upload Photo
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div> */}

                    <div className="w-full flex items-center justify-center gap-4">
                        {/* Full Name */}
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-gray-700 dark:text-white">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            />
                        </div>
                        {/* Mobile */}
                        <div className="mb-4">
                            <label htmlFor="mobile" className="block text-gray-700 dark:text-white">Mobile</label>
                            <input
                                type="number"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 dark:text-white">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            placeholder="Enter your email"
                        />
                    </div>


                    {/* User ID */}
                    <div className="mb-4">
                        <label htmlFor="userId" className="block text-gray-700 dark:text-white">User ID</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            placeholder="Enter your User ID"
                            readOnly
                        />
                    </div>

                    {(profileData.userType === 'Student') && (
                        <>
                            <div className="w-full flex items-center justify-center gap-4">
                                {/* Fathers Name */}
                                <div className="mb-4">
                                    <label htmlFor="fathersName" className="block text-gray-700 dark:text-white">
                                        Father's Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fathersName"
                                        name="fathersName"
                                        value={formData.fathersName}
                                        onChange={handleInputChange}
                                        placeholder="Father's Name"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                                    />
                                </div>
                                {/* Mother's Name */}
                                <div className="mb-4">
                                    <label htmlFor="mothersName" className="block text-gray-700 dark:text-white">
                                        Mother's Name
                                    </label>
                                    <input
                                        type="text"
                                        id="mothersName"
                                        name="mothersName"
                                        value={formData.mothersName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                                        placeholder="Mother's Name"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-4">
                                {/* Fathers Email */}
                                <div className="mb-4">
                                    <label htmlFor="fathersEmail" className="block text-gray-700 dark:text-white">
                                        Father's Email
                                    </label>
                                    <input
                                        type="text"
                                        id="fathersEmail"
                                        name="fathersEmail"
                                        value={formData.fathersEmail}
                                        onChange={handleInputChange}
                                        placeholder="Enter your Father's email Address"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                                    />
                                </div>
                                {/* Mother's Email */}
                                <div className="mb-4">
                                    <label htmlFor="mothersEmail" className="block text-gray-700 dark:text-white">
                                        Mother's Email
                                    </label>
                                    <input
                                        type="text"
                                        id="mothersEmail"
                                        name="mothersEmail"
                                        value={formData.mothersEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                                        placeholder="Enter your Mother's email Address"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditProfileForm;
