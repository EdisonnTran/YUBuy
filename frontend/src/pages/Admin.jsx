import { useState } from 'react'
 
const tableHeaderStyle = {
  color: '#aaaaaa',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '1px solid #3a3a3a',
}
 
const tableCellStyle = {
  color: 'white',
  fontSize: '14px',
  padding: '12px',
  borderBottom: '1px solid #333333',
}
 
const tabActiveStyle = {
  padding: '10px 24px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#CC0000',
  color: 'white',
}
 
const tabInactiveStyle = {
  padding: '10px 24px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#3a3a3a',
  color: '#aaaaaa',
}
 
const actionBtnStyle = {
  padding: '6px 14px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
}
 
const getBadgeStyle = (status) => {
  const base = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  }
  if (status === 'Active') return { ...base, backgroundColor: '#1a3a1a', color: '#4caf50' }
  if (status === 'Flagged' || status === 'Reported') return { ...base, backgroundColor: '#3a1a1a', color: '#f44336' }
  return { ...base, backgroundColor: '#3a2e00', color: '#ffb300' }
}