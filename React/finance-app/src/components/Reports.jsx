import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/api';

const formatDate = (d) => d.toISOString().slice(0,10);

const Reports = ({ isOpen, onClose, onApplyFilters }) => {
  const [range, setRange] = useState('last1m');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [fyStartMonth, setFyStartMonth] = useState(4); // default April
  const [preview, setPreview] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const calcRangeDates = () => {
    const now = new Date();
    let start_date, end_date;
    if (range === 'last7') {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      start_date = formatDate(s); end_date = formatDate(now);
    } else if (range === 'last1m') {
      const s = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      start_date = formatDate(s); end_date = formatDate(now);
    } else if (range === 'last6m') {
      const s = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      start_date = formatDate(s); end_date = formatDate(now);
    } else if (range === 'current_fy') {
      const y = now.getFullYear();
      const startMonth = parseInt(fyStartMonth, 10) - 1;
      const fyStart = now.getMonth() >= startMonth ? new Date(y, startMonth, 1) : new Date(y-1, startMonth, 1);
      start_date = formatDate(fyStart); end_date = formatDate(now);
    } else if (range === 'last_fy') {
      const y = now.getFullYear();
      const startMonth = parseInt(fyStartMonth, 10) - 1;
      const fyStart = now.getMonth() >= startMonth ? new Date(y-1, startMonth, 1) : new Date(y-2, startMonth, 1);
      // fyEnd: last day before next fy start
      const fyEnd = new Date(fyStart.getFullYear() + 1, startMonth, 0);
      start_date = formatDate(fyStart); end_date = formatDate(fyEnd);
    } else if (range === 'custom') {
      start_date = customStart || undefined; end_date = customEnd || undefined;
    } else {
      start_date = undefined; end_date = undefined;
    }
    return { start_date, end_date };
  };

  const handlePreview = async () => {
    try {
      setLoadingPreview(true);
      const { start_date, end_date } = calcRangeDates();
      const params = new URLSearchParams();
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);
      const query = params.toString() ? `?${params.toString()}` : '';
      const resp = await api.get(`/transactions${query}`);
      setPreview(resp.data || []);
    } catch (err) {
      console.error('Preview fetch failed', err);
      setPreview([]);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      const { start_date, end_date } = calcRangeDates();
      const params = new URLSearchParams();
      params.append('file_type', type);
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);
      const resp = await api.get(`/transactions/reports/download?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${start_date || 'all'}_${end_date || 'all'}.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download report.');
    }
  };

  const handleApply = () => {
    const { start_date, end_date } = calcRangeDates();
    onApplyFilters({ start_date, end_date });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Reports</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Ranges</label>
          <div className="flex flex-wrap gap-2 mb-2">
            <button onClick={() => setRange('last7')} className={`px-3 py-1 rounded ${range==='last7' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Last 7 days</button>
            <button onClick={() => setRange('last1m')} className={`px-3 py-1 rounded ${range==='last1m' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Last month</button>
            <button onClick={() => setRange('last6m')} className={`px-3 py-1 rounded ${range==='last6m' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Last 6 months</button>
            <button onClick={() => setRange('current_fy')} className={`px-3 py-1 rounded ${range==='current_fy' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Current FY</button>
            <button onClick={() => setRange('last_fy')} className={`px-3 py-1 rounded ${range==='last_fy' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Last FY</button>
            <button onClick={() => setRange('custom')} className={`px-3 py-1 rounded ${range==='custom' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Custom</button>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm">FY start month</label>
            <select value={fyStartMonth} onChange={(e)=>setFyStartMonth(e.target.value)} className="border rounded px-2 py-1">
              {Array.from({length:12}).map((_,i)=>{
                const m = i+1; return <option key={m} value={m}>{new Date(0,m-1).toLocaleString('default',{month:'long'})}</option>
              })}
            </select>
          </div>

          {range === 'custom' && (
            <div className="flex space-x-2 mt-2">
              <input type="date" value={customStart} onChange={(e)=>setCustomStart(e.target.value)} className="border rounded px-2 py-1" />
              <input type="date" value={customEnd} onChange={(e)=>setCustomEnd(e.target.value)} className="border rounded px-2 py-1" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={handlePreview} className="bg-gray-200 px-3 py-2 rounded inline-flex items-center"><svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4" /></svg>Preview</button>
          <button onClick={()=>handleDownload('csv')} className="bg-green-500 text-white px-3 py-2 rounded inline-flex items-center"><svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>CSV</button>
          <button onClick={()=>handleDownload('pdf')} className="bg-gray-800 text-white px-3 py-2 rounded inline-flex items-center"><svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l7 4v12l-7 4-7-4V6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>PDF</button>
          <div className="flex-1" />
          <button onClick={handleApply} className="bg-blue-600 text-white px-3 py-2 rounded inline-flex items-center"><svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>Apply</button>
        </div>

        <div className="max-h-64 overflow-auto border rounded p-2">
          {loadingPreview ? <div className="text-center py-4">Loading preview...</div> : (
            preview.length === 0 ? <div className="text-center py-4 text-gray-600">No transactions in preview</div> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100"><th className="px-2 py-1">Amount</th><th className="px-2 py-1">Category</th><th className="px-2 py-1">Type</th><th className="px-2 py-1">Date</th></tr>
                </thead>
                <tbody>
                  {preview.map(t=> (
                    <tr key={t.id} className="border-t"><td className="px-2 py-1"><span className={t.is_income ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>${t.amount.toFixed(2)}</span></td><td className="px-2 py-1">{t.category || t.category_name || `Category ${t.category_id}`}</td><td className="px-2 py-1">{t.is_income? 'Income': 'Expense'}</td><td className="px-2 py-1">{t.date}</td></tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
};

Reports.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onApplyFilters: PropTypes.func
};

export default Reports;
