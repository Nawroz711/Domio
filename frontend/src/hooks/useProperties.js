import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import axiosClient from '../lib/axiosClient'
import { useSearchParams } from 'react-router-dom'
import { useState } from "react"
import { toast } from 'react-toastify'

export function useProperties(initialLimit = 10) {

    const [searchParams, setSearchParams] = useSearchParams()
    // Read initial values from URL
    const initialPage = parseInt(searchParams.get('page')) || 1
    const initialLimitFromUrl = parseInt(searchParams.get('limit')) || initialLimit
    const initialSearch = searchParams.get('search') || ''

    const [page, setPage] = useState(initialPage)
    const [limit, setLimit] = useState(initialLimitFromUrl)
    const [search, setSearch] = useState(initialSearch)

    // Build query params
    const queryParams = {
        page,
        limit,
        ...(search && { search }),
    }

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', limit.toString())
        if (search) params.set('search', search)
        setSearchParams(params)
    }, [page, limit, search, setSearchParams])

    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['properties', page, limit, search],
        queryFn: () => fetchProperties(queryParams),
        keepPreviousData: true,
    })

    const fetchProperties = async (params) => {
        const res = await axiosClient.get('/properties', { params })
        return res.data
    }

    const toggleMutation = useMutation({
        mutationFn: async ({ id, isActive }) => {
            const res = await axiosClient.patch(`/properties/${id}`, { isActive })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['properties'])
            toast.success('Property status updated successfully')
        },
        onError: (error) => {
            toast.error('Failed to update property status')
            console.error('Toggle error:', error)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosClient.delete(`/properties/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['properties'])
            toast.success('Property deleted successfully')
        },
        onError: (error) => {
            toast.error('Failed to delete property')
            console.error('Delete error:', error)
        }
    })

    const handleStatusToggle = (property) => {
        toggleMutation.mutate({ id: property._id, isActive: !property.isActive })
    }

    const handleDelete = (property) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            deleteMutation.mutate(property._id)
        }
    }

    const handleSearchChange = (value) => {
        setSearch(value)
        setPage(1) // Reset to first page on search
    }

    const handlePageClick = ({ selected }) => {
        setPage(selected + 1)
    }



    return {
        ...query,
        page,
        limit,
        setLimit,
        search,
        handleSearchChange,
        handlePageClick,
        handleStatusToggle,
        handleDelete,
    }

}