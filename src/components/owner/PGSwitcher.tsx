import React, { useState, useEffect } from 'react';
import { Building2, Plus, Check, ChevronDown, MapPin, Phone, Sparkles, X } from 'lucide-react';
import { PGProperty } from '../../types';
import { apiService } from '../../services/api';

interface PGSwitcherProps {
  selectedPgId: string;
  onSelectPg: (pgId: string) => void;
  showAllOption?: boolean;
}

export const PGSwitcher: React.FC<PGSwitcherProps> = ({
  selectedPgId,
  onSelectPg,
  showAllOption = true
}) => {
  const [pgList, setPgList] = useState<PGProperty[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New PG Form State
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newOwner, setNewOwner] = useState('Mr. Rajesh Verma');
  const [newMobile, setNewMobile] = useState('+91 98765 43210');
  const [newWhatsapp, setNewWhatsapp] = useState('919876543210');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPGs = async () => {
    try {
      const pgs = await apiService.getPGList();
      setPgList(pgs);
    } catch (err) {
      console.error('Failed to fetch PGs:', err);
    }
  };

  useEffect(() => {
    fetchPGs();
  }, []);

  const handleCreatePG = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress) return;

    setIsSubmitting(true);
    try {
      const created = await apiService.createPG({
        name: newName,
        tagline: newTagline || 'Comfortable Living, Connected Digitally',
        address: newAddress,
        owner_name: newOwner,
        mobile_number: newMobile,
        whatsapp_number: newWhatsapp,
        description: newDesc || 'Modern luxury PG accommodation with high-speed Wi-Fi and healthy meals.'
      });

      await fetchPGs();
      onSelectPg(created.id);
      setShowAddModal(false);
      // Reset
      setNewName('');
      setNewTagline('');
      setNewAddress('');
      setNewDesc('');
    } catch (err) {
      console.error('Failed to create PG:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPG = pgList.find(p => p.id === selectedPgId);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                Active Property
              </span>
              <span className="text-xs text-slate-400">({pgList.length} Properties Managed)</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 truncate">
              {selectedPgId === 'all' ? 'All PG Branches (Consolidated Overview)' : selectedPG?.name || 'Main Branch'}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Dropdown Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-all border border-slate-200"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="max-w-[150px] truncate">
                {selectedPgId === 'all' ? 'All PGs' : selectedPG?.name || 'Select PG'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch PG Property
                </div>

                {showAllOption && (
                  <button
                    type="button"
                    onClick={() => { onSelectPg('all'); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedPgId === 'all' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      <span>All Properties (Consolidated)</span>
                    </div>
                    {selectedPgId === 'all' && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                {pgList.map((pg) => (
                  <button
                    key={pg.id}
                    type="button"
                    onClick={() => { onSelectPg(pg.id); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedPgId === pg.id ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium'}`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate font-semibold">{pg.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{pg.address}</div>
                    </div>
                    {selectedPgId === pg.id && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add New PG Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Add New PG</span>
          </button>
        </div>
      </div>

      {/* Add New PG Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Add New PG Property</h3>
                  <p className="text-[11px] text-slate-500">Expand your PG business with a new branch</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePG} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  PG Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. PG Connect Executive (HSR Layout)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="e.g. Premium Stay for IT Professionals"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Complete Address & Location *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. 58, 14th Main, HSR Layout Sector 2, Bengaluru - 560102"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Property Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe key features, nearby tech parks, metro access..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating PG...' : 'Create PG Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
