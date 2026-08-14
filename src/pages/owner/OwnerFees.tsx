import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Filter, Edit, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { FeeRecord, PaymentStatus, ResidentProfile, PGProperty } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

interface OwnerFeesProps {
  selectedPgId?: string;
}

export const OwnerFees: React.FC<OwnerFeesProps> = ({ selectedPgId = 'all' }) => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [residents, setResidents] = useState<ResidentProfile[]>([]);
  const [pgList, setPgList] = useState<PGProperty[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);

  // Form State
  const [targetPgId, setTargetPgId] = useState('pg_1');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [monthYear, setMonthYear] = useState('August 2026');
  const [monthlyFee, setMonthlyFee] = useState<number>(9500);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState('2026-08-05');
  const [notes, setNotes] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    try {
      const [allFees, resList, pgs] = await Promise.all([
        apiService.getAllFees(selectedPgId),
        apiService.getResidents(selectedPgId),
        apiService.getPGList()
      ]);
      setFees(allFees);
      setResidents(resList);
      setPgList(pgs);
      if (resList.length > 0) setSelectedUserId(resList[0].user_id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPgId]);

  const openAddModal = () => {
    setEditingFee(null);
    setTargetPgId(selectedPgId !== 'all' ? selectedPgId : (pgList[0]?.id || 'pg_1'));
    if (residents.length > 0) setSelectedUserId(residents[0].user_id);
    setMonthlyFee(9500);
    setPaidAmount(0);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (fee: FeeRecord) => {
    setEditingFee(fee);
    setTargetPgId(fee.pg_id || 'pg_1');
    setSelectedUserId(fee.user_id);
    setMonthYear(fee.month_year);
    setMonthlyFee(fee.monthly_fee);
    setPaidAmount(fee.paid_amount);
    setDueDate(fee.due_date);
    setNotes(fee.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<FeeRecord> = {
        id: editingFee?.id,
        user_id: selectedUserId,
        pg_id: targetPgId,
        month_year: monthYear,
        monthly_fee: Number(monthlyFee),
        paid_amount: Number(paidAmount),
        due_date: dueDate,
        notes
      };

      await apiService.saveFeeRecord(payload, targetPgId);
      setToastMsg('Fee record saved successfully!');
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      f.room_number?.includes(search) ||
      f.month_year.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Resident Fees</h2>
          <p className="text-xs text-slate-500">
            {selectedPgId === 'all' ? 'Track rent collections and balances across all properties' : 'Rent dues and payment records for active PG'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resident, room..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fee Record</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Fees Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Resident / Room</th>
                <th className="p-4">PG Property</th>
                <th className="p-4">Billing Month</th>
                <th className="p-4">Monthly Rent</th>
                <th className="p-4">Paid Amount</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{fee.full_name}</div>
                      <div className="text-[11px] text-slate-500">Room {fee.room_number}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {fee.pg_name || fee.branch}
                    </td>
                    <td className="p-4 font-bold text-slate-700">{fee.month_year}</td>
                    <td className="p-4 font-bold text-slate-900">₹{fee.monthly_fee.toLocaleString('en-IN')}</td>
                    <td className="p-4 font-extrabold text-emerald-600">₹{fee.paid_amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 font-extrabold text-rose-600">₹{fee.balance.toLocaleString('en-IN')}</td>
                    <td className="p-4"><Badge status={fee.payment_status} type="payment" /></td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(fee)}
                        className="inline-flex items-center space-x-1 text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl font-bold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {editingFee ? 'Update Fee Record' : 'Add New Fee Record'}
              </h3>
              <p className="text-xs text-slate-500">Record payment collection and update pending dues</p>
            </div>

            <form onSubmit={handleSaveFee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  PG Property
                </label>
                <select
                  value={targetPgId}
                  onChange={(e) => setTargetPgId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {pgList.map((pg) => (
                    <option key={pg.id} value={pg.id}>
                      {pg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Resident *
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {residents.map((r) => (
                    <option key={r.user_id} value={r.user_id}>
                      {r.full_name} (Room {r.room_number} - {r.pg_name || r.branch})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Month & Year *</label>
                  <input
                    type="text"
                    required
                    value={monthYear}
                    onChange={(e) => setMonthYear(e.target.value)}
                    placeholder="e.g. August 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Paid Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Notes / UPI Ref</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Paid via UPI Ref #987654"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                >
                  Save Fee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
