import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, IndianRupee, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { FeeRecord } from '../../types';
import { Badge } from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

export const ResidentFeeDetails: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFees() {
      try {
        const data = await apiService.getMyFees();
        setFees(data);
      } finally {
        setLoading(false);
      }
    }
    fetchFees();
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Personal Fee Details</h2>
          <p className="text-xs text-slate-500">Private payment records maintained securely by PG owner</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      {fees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No fee records found</h3>
          <p className="text-xs text-slate-400">Your monthly fee statements will appear here once issued by owner.</p>
        </div>
      ) : (
        fees.map((fee) => (
          <div key={fee.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Billing Period</span>
                <h3 className="font-extrabold text-xl text-slate-900">{fee.month_year}</h3>
              </div>
              <Badge status={fee.payment_status} type="payment" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Monthly Fee</span>
                <p className="font-extrabold text-lg text-slate-900">₹{fee.monthly_fee.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-emerald-700 font-medium">Amount Paid</span>
                <p className="font-extrabold text-lg text-emerald-800">₹{fee.paid_amount.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-rose-700 font-medium">Remaining Balance</span>
                <p className="font-extrabold text-lg text-rose-800">₹{fee.balance.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Due Date</span>
                <p className="font-bold text-sm text-slate-800">{fee.due_date}</p>
              </div>
            </div>

            {fee.notes && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800">Owner Note: </span>
                <span>{fee.notes}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
