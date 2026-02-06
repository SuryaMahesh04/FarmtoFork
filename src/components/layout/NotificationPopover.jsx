import React, { useState, useEffect } from 'react';
import { X, Truck, Check, XCircle } from 'lucide-react';
import { notificationStore } from '../../utils/notificationStore';
import { shipmentStore } from '../../utils/shipmentStore';
import Button from '../ui/Button';

const NotificationPopover = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('pending');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setNotifications(notificationStore.getAll());
        }
    }, [isOpen]);

    const handleStatusUpdate = (id, status) => {
        // If accepting, automatically create a shipment
        if (status === 'accepted') {
            const notification = notifications.find(n => n.id === id);
            if (notification) {
                // Parse "Item (Qty)" format
                const cargoMatch = notification.cargo.match(/(.+?)\s*\((.+?)\)/);
                const cargoItem = cargoMatch ? cargoMatch[1] : notification.cargo;
                const capacity = cargoMatch ? cargoMatch[2] : 'TBD';

                const newShipment = {
                    id: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
                    type: 'Farmer Request',
                    origin: notification.origin,
                    destination: notification.destination,
                    cargo: cargoItem,
                    capacity: capacity,
                    vehicle: 'Pending Assignment',
                    eta: 'Pending',
                    status: 'Pending', // Initial status in Shipments table
                    date: new Date().toISOString().split('T')[0]
                };
                
                shipmentStore.add(newShipment);
            }
        }

        const updated = notificationStore.updateStatus(id, status);
        setNotifications(updated);
    };

    const filteredNotifications = notifications.filter(n => n.status === activeTab);
    const pendingCount = notifications.filter(n => n.status === 'pending').length;

    if (!isOpen) return null;

    return (
        <div className="absolute top-12 right-0 w-[400px] bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-slate-800">Notifications</h3>
                    {pendingCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingCount} Pending
                        </span>
                    )}
                </div>
                <button 
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex px-4 border-b border-slate-100">
                {['pending', 'accepted', 'declined'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all capitalize ${
                            activeTab === tab 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No {activeTab} notifications
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filteredNotifications.map(notification => (
                            <div key={notification.id} className="p-4 hover:bg-slate-50 transition-colors">
                                {/* Header: Icon + Title + Time */}
                                <div className="flex gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Truck size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-slate-800 text-sm">{notification.title}</h4>
                                            <span className="text-xs text-slate-400">{notification.timestamp}</span>
                                        </div>
                                        {/* Farmer Price Row */}
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-sm font-medium text-slate-700">{notification.farmer}</span>
                                            <span className="text-sm font-bold text-slate-900">{notification.price}</span>
                                        </div>
                                        
                                        {/* Location */}
                                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                {notification.origin}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                {notification.destination}
                                            </div>
                                        </div>

                                        {/* Cargo */}
                                        <div className="mt-2 text-xs text-slate-600 bg-slate-100 inline-block px-2 py-1 rounded">
                                            {notification.cargo}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions (Only for Pending) */}
                                {activeTab === 'pending' && (
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 border-dashed">
                                        <Button 
                                            onClick={() => handleStatusUpdate(notification.id, 'accepted')}
                                            className="bg-slate-900 hover:bg-slate-800 text-white flex-1 py-1.5 h-auto text-xs"
                                            icon={Check}
                                        >
                                            Accept
                                        </Button>
                                        <Button 
                                            onClick={() => handleStatusUpdate(notification.id, 'declined')}
                                            variant="outline"
                                            className="flex-1 py-1.5 h-auto text-xs text-slate-600 border-slate-200 hover:bg-slate-50"
                                            icon={X}
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPopover;
