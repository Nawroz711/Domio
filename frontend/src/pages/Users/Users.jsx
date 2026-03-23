import DataTable from 'react-data-table-component'
import { useUsers } from "../../hooks/useUsers"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Switch from "react-switch"

export default function Users() {
  const { data, isLoading, isError, page, setPage, limit, setLimit } = useUsers(10)

  const handlePageClick = (event) => {
    setPage(event.selected + 1)
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) {
    toast.error("Failed to fetch users")
    return <p>Error loading users</p>
  }

  const handleStatusToggle = (row) => {
    toast.info(`Toggled status for ${row.name}`)
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
    { name: 'Address', selector: row => row.address, sortable: true },
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
    { name: 'Role', selector: row => row.role, sortable: true },
  ]

  return (
    <>
      <div className="header p-8">
        <p className="header-title text-xl font-bold">User Accounts</p>
        <p className="sub-header-title text-gray-600">Manage your users accounts</p>
        <hr className="text-gray-300 mt-4" />
      </div>

      <div className="body p-4">
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
