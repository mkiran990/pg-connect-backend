import React, { useState, useEffect } from 'react';
import { BedDouble, Plus, Edit, Trash2, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { Room, PGProperty } from '../../types';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

interface OwnerRoomsProps {
  selectedPgId?: string;
}

export const OwnerRooms: React.FC<OwnerRoomsProps> = ({ selectedPgId = 'all' }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pgList, setPgList] = useState<PGProperty[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);

  // Confirmation Delete Modal
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  // Form states
  const [targetPgId, setTargetPgId] = useState('pg_1');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('2 Sharing AC');
  const [sharingCapacity, setSharingCapacity] = useState<number>(2);
  const [monthlyRent, setMonthlyRent] = useState<number>(8000);
  const [yearlyRent, setYearlyRent] = useState<number>(96000);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [facilities, setFacilities] = useState('Wi-Fi, Hot Water, Daily Housekeeping');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    try {
      const [roomsData, pgs] = await Promise.all([
        apiService.getRooms(selectedPgId),
        apiService.getPGList()
      ]);
      setRooms(roomsData);
      setPgList(pgs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPgId]);

  const openAddModal = () => {
    setEditingRoom(null);
    setTargetPgId(selectedPgId !== 'all' ? selectedPgId : (pgList[0]?.id || 'pg_1'));
    setRoomNumber('');
    setRoomType('2 Sharing AC');
    setSharingCapacity(2);
    setMonthlyRent(8500);
    setYearlyRent(102000);
    setIsAvailable(true);
    setFacilities('Attached Bath, Wi-Fi, Hot Water');
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setTargetPgId(room.pg_id || 'pg_1');
    setRoomNumber(room.room_number);
    setRoomType(room.room_type);
    setSharingCapacity(room.sharing_capacity);
    setMonthlyRent(room.monthly_rent);
    setYearlyRent(room.yearly_rent);
    setIsAvailable(Boolean(room.is_available));
    setFacilities(room.facilities);
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!roomNumber || monthlyRent <= 0 || yearlyRent <= 0) {
      setErrorMessage('Please enter valid room number and rent amounts (> 0).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Room> = {
        id: editingRoom?.id,
        pg_id: targetPgId,
        room_number: roomNumber,
        room_type: roomType,
        sharing_capacity: Number(sharingCapacity),
        monthly_rent: Number(monthlyRent),
        yearly_rent: Number(yearlyRent),
        is_available: isAvailable ? 1 : 0,
        facilities
      };

      await apiService.saveRoom(payload, targetPgId);
      
      setSuccessMessage('Room rent updated successfully.');
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save room details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deletingRoomId) return;
    try {
      await apiService.deleteRoom(deletingRoomId);
      setSuccessMessage('Room deleted successfully.');
      setDeletingRoomId(null);
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete room.');
    }
  };

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Rooms & Rent</h2>
          <p className="text-xs text-slate-500">
            {selectedPgId === 'all' ? 'View and update room tariffs across all properties' : 'Configure room tariffs and occupancy for active PG'}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No rooms registered for this property yet. Click "Add New Room" above to create one.
          </div>
        ) : (
          rooms.map((room) => {
            const pg = pgList.find(p => p.id === room.pg_id);
            return (
              <div key={room.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:shadow-hover border border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold text-brand-600 uppercase tracking-wider">
                        {pg?.name || 'Main Branch'}
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        Room {room.room_number}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{room.room_type}</p>
                    </div>
                    <Badge status={room.is_available ? 'Available' : 'Occupied'} type="availability" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 bg-slate-50/50 rounded-2xl p-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Monthly Rent</span>
                      <span className="text-base font-extrabold text-slate-900">₹{room.monthly_rent?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Yearly Rent</span>
                      <span className="text-base font-extrabold text-slate-900">₹{room.yearly_rent?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Amenities</span>
                    <p className="text-xs text-slate-600 line-clamp-2">{room.facilities}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(room)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Tariff</span>
                  </button>
                  <button
                    onClick={() => setDeletingRoomId(room.id)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Add Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {editingRoom ? `Edit Room ${editingRoom.room_number}` : 'Add New Room'}
              </h3>
              <p className="text-xs text-slate-500">Configure room occupancy, pricing, and amenities</p>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign to PG Property *
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room No. *</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="Single Deluxe AC">Single Deluxe AC</option>
                    <option value="2 Sharing AC">2 Sharing AC</option>
                    <option value="2 Sharing Non-AC">2 Sharing Non-AC</option>
                    <option value="3 Sharing AC">3 Sharing AC</option>
                    <option value="3 Sharing Non-AC">3 Sharing Non-AC</option>
                    <option value="Executive Suite">Executive Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={monthlyRent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMonthlyRent(val);
                      setYearlyRent(val * 12);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Yearly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={yearlyRent}
                    onChange={(e) => setYearlyRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Amenities</label>
                <input
                  type="text"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  placeholder="e.g. Attached Bath, Wi-Fi, Split AC, TV"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Availability Status</label>
                <div className="flex items-center space-x-4 pt-1">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={isAvailable}
                      onChange={() => setIsAvailable(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isAvailable}
                      onChange={() => setIsAvailable(false)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Occupied</span>
                  </label>
                </div>
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingRoomId}
        title="Delete Room"
        message="Are you sure you want to remove this room? This action cannot be undone."
        confirmText="Delete Room"
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeletingRoomId(null)}
      />
    </div>
  );
};
