import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import SpeciesTable from "../components/SpeciesTable";
import SpeciesForm from "../components/SpeciesForm";
import { Dialog } from "@headlessui/react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [species, setSpecies] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchSpecies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSpecies = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterType) params.append("type", filterType);
      if (filterStatus) params.append("status", filterStatus);

      const response = await axios.get(
        `http://localhost:3000/api/species?${params.toString()}`
      );
      setSpecies(response.data);
    } catch (error) {
      toast.error("Failed to fetch species");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingSpecies) {
        await axios.put(
          `http://localhost:3000/api/species/${editingSpecies.id}`,
          data
        );
        toast.success("Species updated successfully");
      } else {
        await axios.post("http://localhost:3000/api/species", data);
        toast.success("Species created successfully");
      }
      setIsFormOpen(false);
      setEditingSpecies(null);
      fetchSpecies();
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this species?")) {
      try {
        await axios.delete(`http://localhost:3000/api/species/${id}`);
        toast.success("Species deleted successfully");
        fetchSpecies();
      } catch (error) {
        toast.error("Failed to delete species");
      }
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    try {
      await axios.patch(`http://localhost:3000/api/species/${id}/quantity`, {
        quantity,
      });
      toast.success("Quantity updated successfully");
      fetchSpecies();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Rain Forest Exotics
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-900"
                >
                  Add User
                </Link>
              )}
              <span className="text-gray-700 mr-4">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md px-4 py-2"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded-md px-4 py-2"
              >
                <option value="">All Types</option>
                <option value="PLANT">Plant</option>
                <option value="ANIMAL">Animal</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-4 py-2"
              >
                <option value="">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
              <button
                onClick={fetchSpecies}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Search
              </button>
            </div>
            {user?.role === "ADMIN" && (
              <button
                onClick={() => {
                  setEditingSpecies(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Species
              </button>
            )}
          </div>

          <SpeciesTable
            species={species}
            onEdit={(species) => {
              setEditingSpecies(species);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </main>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {editingSpecies ? "Edit Species" : "Add New Species"}
            </Dialog.Title>
            <SpeciesForm
              species={editingSpecies}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingSpecies(null);
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
