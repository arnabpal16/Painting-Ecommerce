import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaKey,
  FaTruck,
  FaShoppingBag,
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import defaultAvatar from "../assets/avatar/defaultAvatar.jpg"; // Replace with your actual image path
import { BASEAPI } from "../utils/BASE_API.js";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const AccountPage = () => {
  const [selectedTab, setSelectedTab] = useState("delivery-address");
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]); // State for storing user orders
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    street_address: "",
    town_city: "",
    state: "",
    country: "",
    pin_code: "",
    mobile_number: "",
    email: ""
  });

  const toast = useToast();
  const userProfileImage = null;
  const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage

  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    if (selectedTab === "delivery-address") {
      loadAddresses();
    } else if (selectedTab === "orders") {
      loadOrders();
    }
  }, [selectedTab]);

  const loadAddresses = async () => {
    try {
      const response = await axios.get(`${BASEAPI}/get-addresses`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setAddresses(response.data.address);
    } catch (error) {
      toast({
        title: "Error loading addresses",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${BASEAPI}/get-all-orders`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setOrders(response.data.orders);
    } catch (error) {
      toast({
        title: "Error loading orders",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const handleSaveAddress = async () => {
    try {
      const endpoint = editAddress
        ? `${BASEAPI}/update-address`
        : `${BASEAPI}/create-address`;

      const method = editAddress ? "put" : "post";

      const {
        first_name,
        last_name,
        street_address,
        town_city,
        state,
        country,
        pin_code,
        mobile_number,
        email,
      } = formData;

      const data = {
        first_name,
        last_name,
        street_address,
        town_city,
        state,
        country,
        pin_code,
        mobile_number,
        email
      };
      await axios({
        method: method,
        url: endpoint,
        data: data,
        headers: {
          Authorization: `${token}`,
        },
      });

      toast({
        title: editAddress
          ? "Address updated successfully"
          : "Address added successfully",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      await loadAddresses();
      setIsModalOpen(false);
      setEditAddress(null);
      resetFormData();
    } catch (error) {
      toast({
        title: "Error saving address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      first_name: "",
      last_name: "",
      street_address: "",
      town_city: "",
      state: "",
      country: "",
      pin_code: "",
      mobile_number: "",
      email: "",
    });
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.get(`${BASEAPI}/delete-address/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      await loadAddresses();
      toast({
        title: "Address deleted successfully",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openModal = (address = null) => {
    setEditAddress(address);
    setIsModalOpen(true);
    if (address) {
      setFormData(address);
    } else {
      resetFormData();
    }
  };

  // Components for each section
  const renderAddresses = () => (
    <div className="h-[40rem] overflow-auto scrollbar-thin">
      <div className="bg-gray-100 p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>
        <Button
          className="border-2 border-black p-2 rounded-[1rem] bg-black group duration-300 hover:bg-transparent cursor-pointer"
          leftIcon={
            <FaPlus className="text-white group-hover:text-black  duration-300" />
          }
          colorScheme=""
          onClick={() => openModal()}
        >
          <p className="text-white group-hover:text-black  duration-300">
            Add New Address
          </p>
        </Button>
      </div>
      <ul className="mt-4 space-y-4 overflow-y-auto max-h-[35rem]l scrollbar-thin">
        {addresses?.length > 0 ? (
          addresses.map((address) => (
            <li
              key={address.id}
              className="bg-white py-4 px-6 rounded-md shadow flex justify-between items-end"
            >
              <div>
                <p className="font-bold ">
                  {address.first_name} {address.last_name}
                </p>
                <p className="py-2">
                  {address.street_address}, {address.town_city}, {address.state}
                  , {address.country}
                </p>
                <p>Pin Code: {address.pin_code}</p>
                <p>Mobile: {address.mobile_number}</p>
                <p>Email: {address.email}</p>
              </div>
              <div className="flex space-x-3 self-end">
                <div className="border-2 border-black p-2 rounded-[.2rem] bg-black group duration-300 hover:bg-transparent cursor-pointer">
                  <FaEdit
                    className="text-white group-hover:text-black  duration-300"
                    onClick={() => openModal(address)}
                  />
                </div>
                <div className="border-2 border-black p-2 rounded-[.2rem] bg-black group duration-300 hover:bg-transparent cursor-pointer">
                  <FaTrash
                    className="text-white group-hover:text-black  duration-300"
                    onClick={() => handleDeleteAddress(address.id)}
                  />
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="px-4">No addresses found.</p>
        )}
      </ul>
    </div>
  );

  // const renderOrders = () => (
  //   <div className="h-[40rem] overflow-auto scrollbar-thin">
  //     <div className="bg-gray-100 p-4 sticky top-0 z-10">
  //       <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
  //     </div>
  //     <Table variant="simple" bg="white" border="1px" borderColor="gray.300">
  //       <Thead>
  //         <Tr>
  //           <Th>Product</Th>
  //           <Th>Total</Th>
  //           <Th>Status</Th>
  //           <Th>Created At</Th>
  //         </Tr>
  //       </Thead>
  //       <Tbody>
  //         {/* {orders?.length > 0 ? (
  //           orders.map((order) => (
  //             <Tr key={order.order_id}>
  //               <Td>{order.order_id}</Td>
  //               <Td>{order.total}</Td>
  //               <Td>{order.order_status}</Td>
  //               <Td>{new Date(order.order_created_at).toLocaleString()}</Td>
  //             </Tr>
  //           ))
  //         ) : (
  //           <Tr>
  //             <Td colSpan="4" textAlign="center">No orders found.</Td>
  //           </Tr>
  //         )} */}
  //         <Tr >
  //               <Td>Krishna Talapatra With frame10*12</Td>
  //               <Td>₹3999</Td>
  //               <Td>

  //               <span className="text-green-700 font-bold ">Delivered</span>
  //               </Td>
  //               <Td>12-08-2024</Td>
  //             </Tr>
  //       </Tbody>
  //     </Table>
  //   </div>
  // );
  const renderOrders = () => (
    <div className="h-[40rem] overflow-auto scrollbar-thin">
      <div className="bg-gray-100 p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      </div>
      <Table variant="simple" bg="white" border="1px" borderColor="gray.300">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Created At</Th>
            <Th>Invoice</Th> {/* New column for the invoice download button */}
          </Tr>
        </Thead>
        <Tbody>
          <Tr >
            <Td>Krishna Talapatra With frame10*12</Td>
            <Td>₹3999</Td>
            <Td>

              <span className="text-green-700 font-bold ">Delivered</span>
            </Td>
            <Td>12-08-2024</Td>
            <Td>
              {/* Dummy Download Invoice Button */}
              <button
                className="border-2 border-black p-2 rounded-[1rem] bg-black group duration-300 hover:bg-transparent hover:text-black cursor-pointer text-white "
                onClick={() => alert('Download invoice feature coming soon!')}
              >
                Invoice
              </button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );


  const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePasswordChange = async (e) => {
      e.preventDefault();

      if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match or fields are empty.",
          status: "warning",
          duration: 2500,
          isClosable: true,
        });
        return;
      }

      if (newPassword === confirmPassword) {
        if (newPassword === currentPassword) {
          toast({
            title: "Validation Error",
            description: "New password cannot be same as current password.",
            status: "warning",
            duration: 2500,
            isClosable: true,
          });
        } else {
          try {
            await axios.post(
              `${BASEAPI}/reset-password`,
              { new_password: newPassword },
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            toast({
              title: "Password Updated",
              description: "Your password has been updated successfully.",
              status: "success",
              duration: 2500,
              isClosable: true,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          } catch (error) {
            toast({
              title: "Update Failed",
              description: "Failed to update password. Please try again.",
              status: "error",
              duration: 2500,
              isClosable: true,
            });
          }
        }
      } else {
        toast({
          title: "Validation Error",
          description: "Passwords do not match.",
          status: "warning",
          duration: 2500,
          isClosable: true,
        });
      }
    };

    return (
      <div className="p-4 md:p-0">
        <h1 className="text-2xl font-bold mb-6">Change Password</h1>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <Button type="submit" colorScheme="" className="border-2 border-black p-2 rounded-[1rem] bg-black group duration-300 hover:bg-transparent cursor-pointer">
            <p className="text-white group-hover:text-black  duration-300">
              Update Password
            </p>
          </Button>
        </form>
      </div>
    );
  };


  // const handleDeleteAccount = async (e) => {
  //   e.preventDefault();
  //   const password = e.target.password.value;

  //   if (!password) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Please enter your password.",
  //       status: "warning",
  //       duration: 2500,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(`${BASEAPI}/delete-account`, {
  //       headers: {
  //         Authorization: `${token}`,
  //       },
  //       data: { password },
  //     });

  //     if (response.status === 200) {
  //       toast({
  //         title: "Account Deleted",
  //         description: "Your account has been deleted successfully.",
  //         status: "success",
  //         duration: 2500,
  //         isClosable: true,
  //       });
  //       localStorage.removeItem("authToken");
  //       navigate("/login");
  //     } else {
  //       throw new Error("Failed to delete account");
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description:
  //         error.response?.data?.message ||
  //         "Failed to delete account. Please try again.",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  // const DeleteAccount = () => (
  //   <div className="p-4 md:p-0">
  //     <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h1>
  //     <form  onSubmit={handleDeleteAccount}>
  //       <div className="mb-4">
  //         <label className="block text-sm font-medium mb-1">Password</label>
  //         <Input
  //           type="password"
  //           className="w-full p-2 border border-gray-300 rounded"
  //         />
  //       </div>
  //       <Button type="submit" colorScheme="red">
  //         Delete Account
  //       </Button>
  //     </form>
  //   </div>
  // );
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: "Validation Error",
        description: "Please enter your password.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.delete(`${BASEAPI}/delete-account`, {
        data: { password },
        headers: {
          Authorization: `${token}`,
        }

      });

      if (response.status === 200) {
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        localStorage.removeItem("authToken");
        navigate("/signin");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to delete account. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const DeleteAccount = () => (
    <div className="p-4 md:p-0">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h1>
      <form onSubmit={handleDeleteAccount}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update the password state on change
            required
          />
        </div>
        <Button type="submit" colorScheme="red">
          Delete Account
        </Button>
      </form>
    </div>
  );


  const renderModal = () => (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editAddress ? "Edit Address" : "Add New Address"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="address-form">
            <Input
              name="first_name"
              placeholder="First Name"
              mb={3}
              value={formData.first_name}
              onChange={handleInputChange}
            />
            <Input
              name="last_name"
              placeholder="Last Name"
              mb={3}
              value={formData.last_name}
              onChange={handleInputChange}
            />
            <Input
              name="street_address"
              placeholder="Address"
              mb={3}
              value={formData.street_address}
              onChange={handleInputChange}
            />
            <Input
              name="town_city"
              placeholder="City"
              mb={3}
              value={formData.town_city}
              onChange={handleInputChange}
            />
            <Input
              name="state"
              placeholder="State"
              mb={3}
              value={formData.state}
              onChange={handleInputChange}
            />
            <Input
              name="country"
              placeholder="Country"
              mb={3}
              value={formData.country}
              onChange={handleInputChange}
            />
            <Input
              name="pin_code"
              placeholder="Pin Code"
              mb={3}
              value={formData.pin_code}
              onChange={handleInputChange}
            />
            <Input
              name="mobile_number"
              placeholder="Mobile Number"
              mb={3}
              value={formData.mobile_number}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              placeholder="Email"
              mb={3}
              value={formData.email}
              onChange={handleInputChange}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSaveAddress}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "delivery-address":
        return renderAddresses();
      case "change-password":
        return <ChangePassword />; // Changed to include API call for resetting password
      case "orders":
        return renderOrders(); // Display the user's orders
      case "delete-account":
        return <DeleteAccount />;
      default:
        return renderAddresses();
    }
  };

  return (
    <div className="flex min-h-screen my-16 w-full md:w-4/5 bg-gray-100 flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 bg-white shadow-md">
        <div className="flex flex-col items-center p-6">
          <img
            src={userProfileImage || defaultAvatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full"
          />
          <h2 className="mt-4 text-xl font-semibold">{user ? `${user.first_name} ${user.last_name}` : 'User'}</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="border-t border-gray-200">
              <button
                onClick={() => setSelectedTab("change-password")}
                className="flex items-center w-full p-4 hover:bg-gray-100"
              >
                <FaKey className="mr-3" />
                Change Password
              </button>
            </li>
            <li className="border-t border-gray-200">
              <button
                onClick={() => setSelectedTab("delivery-address")}
                className="flex items-center w-full p-4 hover:bg-gray-100"
              >
                <FaTruck className="mr-3" />
                Delivery Address
              </button>
            </li>
            <li className="border-t border-gray-200">
              <button
                onClick={() => setSelectedTab("orders")}
                className="flex items-center w-full p-4 hover:bg-gray-100"
              >
                <FaShoppingBag className="mr-3" />
                My Orders
              </button>
            </li>
            <li className="border-t border-gray-200">
              <button
                onClick={() => setSelectedTab("delete-account")}
                className="flex items-center w-full p-4 text-red-600 hover:bg-gray-100"
              >
                <FaTrashAlt className="mr-3" />
                Delete Account
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:p-8 bg-gray-100">{renderContent()}</main>

      {/* Address Modal */}
      {renderModal()}
    </div>
  );
};

export default AccountPage;
