import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import axiosClient from '../lib/axiosClient'

const fetchUsers = async (page = 1, limit = 10) => {
  const res = await axiosClient.get('/users', {
    params: { page, limit }
  })
  return res.data // must include docs, totalDocs, totalPages, etc.
}

export function useUsers(initialLimit = 10) {
  const [searchParams, setSearchParams] = useSearchParams()

  // read initial values from URL
  const initialPage = parseInt(searchParams.get('page')) || 1
  const initialLimitFromUrl = parseInt(searchParams.get('limit')) || initialLimit

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimitFromUrl)

  // keep URL in sync when page/limit changes
  useEffect(() => {
    setSearchParams({ page, limit })
  }, [page, limit, setSearchParams])

  const query = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(page, limit),
    keepPreviousData: true,
  })

  return {
    ...query,
    page,
    setPage,
    limit,
    setLimit,
  }
}
