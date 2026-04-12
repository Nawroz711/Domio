import DataTable from 'react-data-table-component'
import ReactPaginate from "react-paginate"
import Switch from "react-switch"
import { useProperties } from '../../hooks/useProperties'
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react"
import { useNavigate } from 'react-router-dom'

export default function Index() {
    const navigate = useNavigate()
    const { search, handleSearchChange, data, isLoading, limit, setLimit, handlePageClick, handleStatusToggle, handleDelete, page } = useProperties(10)

    const handleView = (row) => {
        navigate(`/admin/properties/${row._id}`)
    }

    const handleEdit = (row) => {
        navigate(`/admin/properties/${row._id}/edit`)
    }

    // Database columns for properties section
    const columns = [
        {
            name: '#',
            selector: (row, index) => (page - 1) * limit + index + 1,
            width: '60px',
            center: true,
        },
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Listing Type', selector: row => row.listingType, sortable: true },
        { name: 'Property Type', selector: row => row.propertyType, sortable: true },
        { name: 'Address', selector: row => row.address, sortable: true },
        { name: 'Province', selector: row => row.province, sortable: true },
        { name: 'Agent', selector: row => row.agent?.name || 'N/A', sortable: true },
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
        {
            name: 'Actions',
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-green-500 hover:text-green-700 p-1"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '120px',
        },
    ]

    return (
        <>
            <div className="header px-4 py-6">
                <p className="header-title text-xl font-bold">Properties</p>
                <p className="sub-header-title text-gray-600">Manage your properties</p>
                <hr className="text-gray-300 mt-4" />
            </div>

            <div className="body px-4">

                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search properties"
                        className="border rounded px-2 py-1 flex-1"
                    />
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