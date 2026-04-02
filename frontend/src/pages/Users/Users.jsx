import DataTable from 'react-data-table-component'
import { useUsers } from "../../hooks/useUsers"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import Switch from "react-switch"
import axiosClient from "../../lib/axiosClient"
import provinces from "../../const/provinces"
import { useState } from "react"

// Role options
const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'agent', label: 'Agent' },
]

// Status options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

export default function Users() {
  const { 
    data, 
    isLoading, 
    isError, 
    page, 
    setPage, 
    limit, 
    setLimit,
    search,
    setSearch,
    province,
    setProvince,
    status,
    setStatus,
    role,
    setRole,
    resetFilters,
    refetch
  } = useUsers(10)

  const [searchInput, setSearchInput] = useState('')

  const handlePageClick = (event) => {
    setPage(event.selected + 1)
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
  }

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('')
    setSearch('')
  }

  // Handle status toggle
  const handleStatusToggle = async (row) => {
    try {
      const newStatus = !row.isActive
      await axiosClient.patch(`/users/${row._id}/status`, {
        isActive: newStatus
      })
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`)
      refetch()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status')
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) {
    toast.error("Failed to fetch users")
    return <p>Error loading users</p>
  }

  const columns = [
    {
      name: '#',
      selector: (row, index) => (page - 1) * limit + index + 1,
      width: '60px',
      center: true,
    },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Phone', selector: row => row.phone, sortable: true },
    { name: 'Province', selector: row => row.province, sortable: true },
    // { name: 'Address', selector: row => row.address, sortable: true },
    {
      name: 'Status',
      cell: row => (
        <Switch
          onChange={() => handleStatusToggle(row)}
          checked={row.isActive}
          onColor="#2563eb"
          offColor="#d1d5db"
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    // { name: 'Role', selector: row => row.role, sortable: true },
  ]

  return (
    <>
      <div className="header px-4 py-6">
        <p className="header-title text-xl font-bold">User Accounts</p>
        <p className="sub-header-title text-gray-600">Manage your users accounts</p>
        <hr className="text-gray-300 mt-4" />
      </div>

      <div className="body px-4">
        {/* Search and Filters */}
        <div className="mb-4 flex flex-wrap gap-4 items-end">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:brightness-95"
            >
              Search
            </button>
          </form>

          {/* Province Filter */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px]"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px]"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {(search || province || status || role) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={data?.docs || []}
          progressPending={isLoading}
          highlightOnHover
          striped
        />


        <div className="flex justify-between items-center border-t border-gray-300 mb-12">
          {/* Total records + Items per page selector */}
          <div className="flex gap-x-6 items-center mt-2">
            <div className="text-sm text-gray-600">
              Total Records: {data?.totalDocs || 0}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Items per page:</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Pagination */}
          <ReactPaginate
            previousLabel={<ChevronLeft className="w-4 h-4" />}
            nextLabel={<ChevronRight className="w-4 h-4" />}
            breakLabel={'...'}
            pageCount={data?.totalPages || 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            forcePage={page - 1}
            containerClassName="flex justify-end gap-1 mt-4"
            pageClassName="list-none"
            pageLinkClassName="px-2 border border-gray-300  rounded cursor-pointer text-primary hover:bg-blue-50 block"
            previousClassName="list-none"
            previousLinkClassName="px-2 py-1 border  border-gray-300 rounded cursor-pointer text-primary hover:bg-blue-50 flex items-center"
            nextClassName="list-none"
            nextLinkClassName="px-2 py-1 border  border-gray-300 rounded cursor-pointer text-primary hover:bg-blue-50 flex items-center"
            breakClassName="list-none"
            breakLinkClassName="px-2 py-1 text-gray-500 block"
            activeLinkClassName="bg-primary text-white border-primary"
          />
        </div>
      </div>
    </>
  )
}
