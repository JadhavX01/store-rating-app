import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStorePage = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    ownerName: '',
    ownerEmail: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stores', {
        params: { ...filters, sortBy, order }
      });
      setStores(res.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, order]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Admin Stores</h2>

      {/* 🔎 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <input name="name" placeholder="Store Name" className="p-2 border rounded" onChange={handleInputChange} />
        <input name="email" placeholder="Store Email" className="p-2 border rounded" onChange={handleInputChange} />
        <input name="address" placeholder="Store Address" className="p-2 border rounded" onChange={handleInputChange} />
        <input name="ownerName" placeholder="Owner Name" className="p-2 border rounded" onChange={handleInputChange} />
        <input name="ownerEmail" placeholder="Owner Email" className="p-2 border rounded" onChange={handleInputChange} />
      </div>

      {/* 📊 Sorting */}
      <div className="flex gap-4 mb-4">
        <select className="p-2 border rounded" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort by Store Name</option>
          <option value="email">Sort by Store Email</option>
          <option value="address">Sort by Address</option>
        </select>
        <select className="p-2 border rounded" value={order} onChange={e => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* 📋 Table */}
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Owner</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="border px-4 py-2">{store.name}</td>
              <td className="border px-4 py-2">{store.email || 'N/A'}</td>
              <td className="border px-4 py-2">{store.address}</td>
              <td className="border px-4 py-2">{store.rating ?? 'N/A'}</td>
              <td className="border px-4 py-2">
                {store.owner_name
                  ? `${store.owner_name} (${store.owner_email})`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStorePage;
