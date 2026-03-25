import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import axiosClient from '../lib/axiosClient'

const fetchUsers = async (params) => {
  const res = await axiosClient.get('/users', { params })
  return res.data
}

export function useUsers(initialLimit = 10) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read initial values from URL
  const initialPage = parseInt(searchParams.get('page')) || 1
  const initialLimitFromUrl = parseInt(searchParams.get('limit')) || initialLimit
  const initialSearch = searchParams.get('search') || ''
  const initialProvince = searchParams.get('province') || ''
  const initialStatus = searchParams.get('status') || ''
  const initialRole = searchParams.get('role') || ''

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimitFromUrl)
  const [search, setSearch] = useState(initialSearch)
  const [province, setProvince] = useState(initialProvince)
  const [status, setStatus] = useState(initialStatus)
  const [role, setRole] = useState(initialRole)

  // Build query params
  const queryParams = {
    page,
    limit,
    ...(search && { search }),
    ...(province && { province }),
    ...(status && { status }),
    ...(role && { role }),
  }

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('limit', limit.toString())
    if (search) params.set('search', search)
    if (province) params.set('province', province)
    if (status) params.set('status', status)
    if (role) params.set('role', role)
    setSearchParams(params)
  }, [page, limit, search, province, status, role, setSearchParams])

  const query = useQuery({
    queryKey: ['users', page, limit, search, province, status, role],
    queryFn: () => fetchUsers(queryParams),
    keepPreviousData: true,
  })

  // Debounced search
  const debouncedSearch = useCallback((value) => {
    setSearch(value)
    setPage(1) // Reset to first page on search
  }, [])

  // Filter handlers
  const handleProvinceChange = (value) => {
    setProvince(value)
    setPage(1)
  }

  const handleStatusChange = (value) => {
    setStatus(value)
    setPage(1)
  }

  const handleRoleChange = (value) => {
    setRole(value)
    setPage(1)
  }

  const resetFilters = () => {
    setSearch('')
    setProvince('')
    setStatus('')
    setRole('')
    setPage(1)
  }

  return {
    ...query,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch: debouncedSearch,
    province,
    setProvince: handleProvinceChange,
    status,
    setStatus: handleStatusChange,
    role,
    setRole: handleRoleChange,
    resetFilters,
  }
}
