import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function pageNumbers(currentPage: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'gap')[] = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) pages.push('gap')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('gap')
  pages.push(totalPages)

  return pages
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const go = (page: number) => {
    onPageChange(page)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => go(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {pageNumbers(currentPage, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="pagination-gap">…</span>
        ) : (
          <button
            key={item}
            className={item === currentPage ? 'pagination-page active' : 'pagination-page'}
            onClick={() => go(item)}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        className="pagination-arrow"
        disabled={currentPage === totalPages}
        onClick={() => go(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </nav>
  )
}
