"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Select from 'react-select';


const Page = () => {

  const [totalSum, setTotalSum] = useState(0);
  const [GSTtax, setGSTtax] = useState("none")
  const [TotalGST, setTotalGST] = useState(0)
  const [Discount, setDiscount] = useState(0)
  const [OrderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])

  const [totalAfterDiscount, setTotalAfterDiscount] = useState(totalSum);

  // Function to calculate the discount
  const calculateDiscount = (discountValue) => {
    const discountAmount = (totalSum * discountValue) / 100;
    setTotalAfterDiscount(totalSum - discountAmount);
  };

  // Handle discount input change
  const handleDiscountChange = (e) => {
    const discountValue = parseFloat(e.target.value);
    setDiscount(discountValue);
    calculateDiscount(discountValue);
  };

  const [rows, setRows] = useState([
    { productId: '', quantity: 1 },
  ]);

  const handleProductChange = (index, productId) => {
    const newRows = [...rows];
    newRows[index].productId = productId;
    setRows(newRows);
  };

  const handleQuantityChange = (index, quantity) => {
    const newRows = [...rows];
    newRows[index].quantity = quantity;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { productId: '', quantity: 1 }]);
    console.log(rows);
  };


  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };


  const calculateTotalSum = () => {
    let sum = 0;
    rows.forEach(row => {
      const product = ProductList.find(product => product.ProductID === row.productId);
      const total = row.quantity * (product ? product.ProductPrice : 0);
      sum += total;
    });
    if (GSTtax === "none") {
      setTotalSum(parseFloat(sum.toFixed(2)));
      setTotalGST(0);
    }
    if (GSTtax === "i_GST5") {
      setTotalSum(parseFloat((sum + (sum * 0.05)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.05).toFixed(2)));
    }
    if (GSTtax === "i_GST12") {
      setTotalSum(parseFloat((sum + (sum * 0.12)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.12).toFixed(2)));
    }
    if (GSTtax === "i_GST18") {
      setTotalSum(parseFloat((sum + (sum * 0.18)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.18).toFixed(2)));
    }

    if (GSTtax === "sc_GST5") {
      setTotalSum(parseFloat((sum + (sum * 0.05)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.05).toFixed(2)));
    }
    if (GSTtax === "sc_GST12") {
      setTotalSum(parseFloat((sum + (sum * 0.12)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.12).toFixed(2)));
    }
    if (GSTtax === "sc_GST18") {
      setTotalSum(parseFloat((sum + (sum * 0.18)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.18).toFixed(2)));
    }
  };




  const [CustomersList, setCustomersList] = useState([]);
  const [SalesManList, setSalesManList] = useState([]);
  const [ProductList, setProductList] = useState([]);

  const [OrderID, setOrderID] = useState("")
  const [CustomerID, setCustomerID] = useState("")
  const [CustomerName, setCustomerName] = useState("")
  const [CustomerPhone, setCustomerPhone] = useState("")
  const [CustomerEmail, setCustomerEmail] = useState("")

  const [TotalAmount, setTotalAmount] = useState("")
  const [TrackingNo, setTrackingNo] = useState("")
  const [cost, setCost] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [TrackingStatus, setTrackingStatus] = useState('pending');
  const [courierName, setCourierName] = useState('fedex');


  const [PaymentMode, setPaymentMode] = useState('');
  const [PaymentStatus, setPaymentStatus] = useState('');
  const [PaymentChannel, setPaymentChannel] = useState('');
  const [PaymentDate, setPaymentDate] = useState('');
  const [OrderAmount, setOrderAmount] = useState('');
  const [PaymentID, setPaymentID] = useState([])
  const [TrackingID, setTrackingID] = useState([])

  const [SalesChannel, setSalesChannel] = useState("None")
  const [Address, setAddress] = useState("")
  const [Pincode, setPincode] = useState("")

  const [PaymentNo, setPaymentNo] = useState("")

  function addCustomer() {
    // Fetch data from the API
    const postData = {
      CustomerID: CustomerID,
      CustomerName: CustomerName,
      CustomerPhone: CustomerPhone,
      CustomerEmail: CustomerEmail,
    };


    fetch("/api/addCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data.customer);
          location.reload();
          setCustomerName(data.customer.CustomerName)
          setCustomerPhone(data.customer.CustomerPhone)
          setCustomerEmail(data.customer.CustomerEmail)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    calculateTotalSum();
  }, [rows, ProductList, GSTtax]);


  const handleCustomerSelection = (event) => {
    const selectedValue = event.target.value;
    const [selectedCustomerID, selectedCustomerName, selectedCustomerPhone, selectedCustomerEmail] = selectedValue.split(" | ");
    // You can perform additional actions based on the selected customer
    console.log("Selected Customer ID:", selectedCustomerID);
    console.log("Selected Customer Name:", selectedCustomerName);

    setCustomerID(selectedCustomerID);
    setCustomerName(selectedCustomerName)
    setCustomerPhone(selectedCustomerPhone)
    setCustomerEmail(selectedCustomerEmail)

  };



  const [msg, setmsg] = useState("")


  useEffect(() => {
    // auth();
    fetch("/api/getCustomer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.customers);
          setCustomersList(data.customers)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch("/api/getSalesMan", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.SalesMans);
          setSalesManList(data.SalesMans)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });


    fetch("/api/getProduct", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.products);
          setProductList(data.products);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  function save() {
    const postData =
    {
      OrderID: OrderID,
      CustomerName: CustomerName,
      CustomerPhone: CustomerPhone,
      Products: rows,
      OrderDate: OrderDate,
      SalesChannel: SalesChannel,
      Address: Address,
      Pincode: Pincode,
      PaymentID: PaymentID,
      TrackingID: TrackingID,
      TrackingStatus: TrackingStatus,
      TaxType: GSTtax,
      GST: TotalGST,
      Total: totalAfterDiscount,
      Discount: totalSum - totalAfterDiscount
    }
    console.log(postData);
    fetch("/api/addOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function saveTrackingDetails() {
    const postData = {
      TrackingNo: TrackingNo,
      cost: cost,
      trackingUrl: trackingUrl,
      TrackingCourier: courierName,
      OrderID: OrderID

    }

    console.log(postData);

    fetch("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          const updatedTrackingID = [...TrackingID];
          updatedTrackingID.push(data.TrackingID);
          setTrackingID(updatedTrackingID);

        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const router = useRouter();
  async function auth() {
    const fetch_api = await fetch("/api/auth/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await fetch_api.json();
    if (!data.success) {
      router.push("/login");
    }
  };

  function savePaymentDetails() {
    const postData = {
      OrderID: OrderID,
      PaymentID: PaymentID,
      PaymentNo: PaymentNo,
      PaymentMode: PaymentMode,
      PaymentStatus: PaymentStatus,
      PaymentChannel: PaymentChannel,
      PaymentDate: PaymentDate,
      PaymentAmount: OrderAmount
    }

    console.log(postData);

    fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          const updatedPaymentID = [...PaymentID];
          updatedPaymentID.push(data.PaymentID);
          setPaymentID(updatedPaymentID);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  return (
    <>

      <div className="mt-20 text-center">
        {/* <h2 className="mb-5 text-2xl font-bold text-center">Create new Order</h2> */}
        <h1 class="mb-4 text-3xl text-center text-red-600 font-extrabold text-gray-900  md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Create</span> New Order</h1>

      </div>
      <div className=" max-w-screen mx-auto container mx-auto border border-3 rounded-lg p-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div>
            {!msg ? ("") : (
              <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                {msg}
              </div>
            )}

            {/* <div className="mb-5">
              <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select or type Customer ID</label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="countries"
                  onChange={handleCustomerSelection}
                  list="country-list"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <button data-modal-target="customer-modal" data-modal-toggle="customer-modal" className="ml-2.5 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">+</button>
              </div>

              <datalist id="country-list">
                {CustomersList.map((customer) => (
                  <option key={customer._id} value={`${customer.CustomerID} | ${customer.CustomerName} | ${customer.CustomerPhone} | ${customer.CustomerEmail}`} />
                ))}
              </datalist>
            </div> */}

            <div className="flex space-x-4 mb-5">
              {/* Customer Name and Customer Phone in one line */}
              <div className="flex-1">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Customer Name</label>
                <input value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" required />
              </div>

              <div className="flex-1">
                <label htmlFor="customerPhone" className="block mb-2 text-sm font-medium text-gray-900">Customer Phone</label>
                <input value={CustomerPhone} onChange={(e) => setCustomerPhone(e.target.value)} id="customerPhone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>




            {/* <div className="mb-5">
              <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
              <textarea value={Address} onChange={(e) => setAddress(e.target.value)} id="sc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
            </div> */}

          </div>

          {/* Right side */}





        </div>
        {/* <button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white px-4 py-1 rounded">New Row +</button> */}



        <input
          type="date"
          name="dob"
          id="dob"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="YYYY-MM-DD"
          required
          onChange={(e) => setOrderDate(e.target.value)}
          value={OrderDate}
          defaultValue={new Date().toISOString().split('T')[0]}
        />

        {/* <a href="/admin/products/add" class="relative text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">
            New Product
          </a> */}
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border py-2 px-4">Product</th>
              <th className="border py-2 px-4">Quantity</th>
              <th className="border py-2 px-4">Total</th>
              <th className="border py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border py-2 px-4">
                  <select value={row.productId} onChange={(e) => handleProductChange(index, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="" disabled>Select a product</option>
                    {ProductList.map((product) => (
                      <option key={product._id} value={product.ProductID}>{product.ProductID}{" "}|{" "}{product.ProductName}{" "}|{" "}{product.ProductHSN}</option>
                    ))}
                  </select>
                </td>
                <td className="border py-2 px-4">
                  <input type="number" value={row.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </td>
                <td className="border py-2 px-4">
                  <input type="text" value={row.quantity * ProductList.find((product) => product.ProductID === row.productId)?.ProductPrice || 0} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </td>
                <td className="border py-2 px-4 flex justify-around">
                  <button onClick={() => handleDeleteRow(index)} className="bg-red-500 text-white px-4 py-2 rounded">X</button>
                  <button onClick={handleAddRow} className="bg-blue-500 ms-1 text-white px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="flex items-start mt-4 flex-col justify-start">
          <div>

            Inter-state GST :
            <select
              value={GSTtax}
              onChange={(e) => {
                setGSTtax(e.target.value);
              }}
              className="me-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-2 p-2.5"
            >
              <option value="none">No GST 0%</option>
              <option value="i_GST5">i GST - 5%</option>
              <option value="i_GST12">i GST - 12%</option>
              <option value="i_GST18">i GST - 18%</option>
            </select>
          </div>

          State + Central GST :
          <select
            value={GSTtax}
            onChange={(e) => {
              setGSTtax(e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-2 p-2.5"
          >
            <option value="none">No GST 0%</option>
            <option value="sc_GST5">S GST 2.5% + C GST 2.5%</option>
            <option value="sc_GST12">S GST 6% + C GST 6%</option>
            <option value="sc_GST18">S GST 18% + C GST 18%</option>
          </select>

          <div className="text-xl mt-2">Total GST: ₹{TotalGST}</div>

        </div> */}

        <p className="text-center text-xl my-3 font-semibold">Sub Amount : ₹ {totalSum}</p>
        <div className="flex flex-col items-center justify-center my-3">
          <div>Total Discount <span className="font-semibold">{Discount}%</span></div>
          <div className="flex items-center">
            <input
              type="number"
              name="cost"
              id="cost"
              value={Discount}
              onChange={handleDiscountChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-14 my-3 p-2.5"
              placeholder="Enter Percentage"
            />
          </div>
          <div className="text-2xl font-semibold">Total Amount: ₹{totalAfterDiscount.toFixed(2)}</div>
        </div>


        <div className="flex justify-center">


          {/* <button data-modal-target="tracking-modal" data-modal-toggle="tracking-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">
            Add Tracking Details
          </button> */}
          {/* <button data-modal-target="payment-modal" data-modal-toggle="payment-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button"> Add Payment Details </button> */}
          <button onClick={save} class="block text-white bg-green-700 hover:bg-red-800 font-semibold rounded-lg text-md px-8 py-2.5 text-center m-2" type="button">Save & Create Order </button>



        </div>


        <div id="customer-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow border-4">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900">
                  Add New Customer
                </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="customer-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                  <div class="max-w-sm mx-auto rounded-lg p-1">
                    {!msg ? ("") : (<div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>)}
                    <div class="mb-5">
                      <label for="id" class="block mb-2 text-sm font-medium text-gray-900">
                        Customer ID
                      </label>
                      <input
                        value={CustomerID}
                        onChange={(e) => setCustomerID(e.target.value)}
                        type="text"
                        id="id"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div class="mb-5">
                      <label
                        for="name"
                        class="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        value={CustomerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        id="name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
                        required
                      />
                    </div>
                    <div class="mb-5">
                      <label
                        for="class"
                        class="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Phone Number
                      </label>
                      <input
                        value={CustomerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        type="text"
                        id="class"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
                        placeholder="9999928938"
                        required
                      />
                    </div>
                    <div class="mb-5">
                      <label
                        for="Contact"
                        class="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Email
                      </label>
                      <input
                        id="Contact"
                        value={CustomerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
                        placeholder="exampkle@email.in"
                        required
                      />
                    </div>

                  </div>
                  <button onClick={addCustomer} type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add New Customer</button>

                </form>
              </div>
            </div>
          </div>
        </div>



        <div id="tracking-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow border-4">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900">
                  Tracking Details for order
                </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="tracking-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">

                  <div>
                    <label for="TrackingNo" class="block mb-2 text-sm font-medium text-gray-900">Tracking ID</label>
                    <input value={TrackingNo} onChange={(e) => setTrackingNo(e.target.value)} type="text" name="TrackingNo" id="TrackingNo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Tracking ID" required />
                  </div>
                  <div>
                    <label for="cost" class="block mb-2 text-sm font-medium text-gray-900">Cost</label>
                    <input value={cost} onChange={(e) => setCost(e.target.value)} type="text" name="cost" id="cost" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Cost" required />
                  </div>
                  <div>
                    <label for="cost" class="block mb-2 text-sm font-medium text-gray-900">Tracking URL</label>
                    <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} type="text" name="cost" id="cost" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Url" required />
                  </div>


                  <div>
                    <label for="courierName" class="block mb-2 text-sm font-medium text-gray-900">Courier Name</label>
                    <select value={courierName} onChange={(e) => setCourierName(e.target.value)} name="courierName" id="courierName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="fedex">FedEx</option>
                      <option value="ekart">EKART</option>
                      <option value="dhl">DHL</option>
                      <option value="bluedart">BlueDart</option>
                    </select>
                  </div>
                  {!msg ? ("") : (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>
                  )}
                  <button onClick={saveTrackingDetails} type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Tracking Details</button>

                </form>
              </div>
            </div>
          </div>
        </div>




        <div id="payment-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow border-4">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900"> Payment Details for order </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="payment-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                  <div>
                    <label for="orderID" class="block mb-2 text-sm font-medium text-gray-900">Payment No</label>
                    <input value={PaymentNo} onChange={(e) => setPaymentNo(e.target.value)} type="text" name="orderID" id="orderID" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Payment No" required />
                  </div>
                  <div>
                    <label for="paymentMode" class="block mb-2 text-sm font-medium text-gray-900">Payment Mode</label>
                    <select value={PaymentMode} onChange={(e) => setPaymentMode(e.target.value)} name="paymentMode" id="paymentMode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>

                      <option value="" disabled>Select</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="net_banking">Net Banking</option>
                    </select>
                  </div>

                  {/* <div>
                    <label for="paymentMode" class="block mb-2 text-sm font-medium text-gray-900">Payment Status</label>
                    <select value={PaymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} name="paymentMode" id="paymentMode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="" disabled>Select</option>
                      <option value="partial">Partial</option>
                      <option value="full">Full</option>

                    </select>
                  </div> */}
                  <div>
                    <label for="paytmChannel" class="block mb-2 text-sm font-medium text-gray-900">Paytm Channel</label>
                    <select value={PaymentChannel} onChange={(e) => setPaymentChannel(e.target.value)} name="paytmChannel" id="paytmChannel" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="" disabled>Select Paytm Channel</option>
                      <option value="Paytm">Paytm</option>
                      <option value="PhonePay">PhonePay</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                  <div>
                    <label for="paymentDate" class="block mb-2 text-sm font-medium text-gray-900">Payment Date</label>
                    <input
                      value={PaymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      type="date"
                      name="paymentDate"
                      id="paymentDate"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter Payment Date"
                      required
                    />
                  </div>

                  <div>
                    <label for="orderAmount" class="block mb-2 text-sm font-medium text-gray-900">Payment Amount</label>
                    <input value={OrderAmount} onChange={(e) => setOrderAmount(e.target.value)} type="text" name="orderAmount" id="orderAmount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Payment Amount" required />
                  </div>
                  {!msg ? ("") : (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>)}
                  <button onClick={savePaymentDetails} type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Payment Details</button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* sdd */}
    </>
  );
};

export default Page;
