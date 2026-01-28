import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { repairAPI, movingAPI, usersAPI } from '../services/api';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

function AdminPage() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();

    // Data States
    const [repairs, setRepairs] = useState([]);
    const [movings, setMovings] = useState([]);
    const [users, setUsers] = useState([]);

    // Report Data States
    const [reportRepairs, setReportRepairs] = useState([]);
    const [reportMovings, setReportMovings] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState('repairs'); // 'repairs', 'movings', 'users', 'reports'
    const [reportTab, setReportTab] = useState('repairs');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Edit User Modal State
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '', lastname: '', email: '', phone: '', position: '', password: ''
    });

    // Auth Check
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return navigate('/login');
        if (user && user.position !== 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'ไม่มีสิทธิ์เข้าถึง',
                text: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้สำหรับผู้ดูแลระบบ',
                confirmButtonColor: '#8B4513'
            }).then(() => {
                navigate('/');
            });
            return;
        }
    }, [user, isAuthenticated, loading, navigate]);

    // Fetch Active Data (for main management)
    const fetchActiveData = async () => {
        try {
            setIsLoading(true);
            const [repairRes, movingRes] = await Promise.all([
                repairAPI.getAllRepairs(),
                movingAPI.getAllMoving()
            ]);

            setRepairs((repairRes.data || []).map(r => ({ ...r, status: r.status || 'pending', approved: r.approved || false })));
            setMovings((movingRes.data || []).map(m => ({ ...m, status: m.status || 'pending', approved: m.approved || false })));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch Report Data (All history including deleted)
    const fetchReportData = async () => {
        try {
            setIsLoading(true);
            const repairRes = await axios.get('http://localhost:5000/api/repair?mode=report');
            const movingRes = await axios.get('http://localhost:5000/api/moving?mode=report');

            setReportRepairs((repairRes.data.data || []).map(r => ({ ...r, status: r.status || 'pending', approved: r.approved || false })));
            setReportMovings((movingRes.data.data || []).map(m => ({ ...m, status: m.status || 'pending', approved: m.approved || false })));
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load & Menu Switch Logic
    useEffect(() => {
        if (user?.position === 'admin') {
            if (activeMenu === 'reports') {
                fetchReportData();
            } else if (activeMenu === 'users') {
                fetchUsers();
            } else {
                fetchActiveData();
            }
        }
    }, [user, activeMenu]);

    const fetchUsers = async () => {
        try {
            const res = await usersAPI.getAllUsers();
            setUsers(res || []);
        } catch (e) { console.log(e); }
    };

    // Actions
    const handleDelete = async (id, type) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลจะถูกย้ายไปเก็บในรายงานประวัติ (Soft Delete)",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก'
        });

        if (!result.isConfirmed) return;

        try {
            if (type === 'repair') {
                await axios.delete(`http://localhost:5000/api/repair/${id}`);
                setRepairs(repairs.filter(r => r.id_repair !== id)); // Remove from UI
            } else {
                await axios.delete(`http://localhost:5000/api/moving/${id}`);
                setMovings(movings.filter(m => m.move_id !== id));
            }
            Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error deleting:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบข้อมูลได้'
            });
        }
    };

    const handleApprovalToggle = async (id, type) => {
        try {
            if (type === 'repair') {
                const item = repairs.find(r => r.id_repair === id);
                await repairAPI.updateRepair(id, { approved: !item.approved });
                setRepairs(repairs.map(r => r.id_repair === id ? { ...r, approved: !r.approved } : r));
            } else {
                const item = movings.find(m => m.move_id === id);
                await movingAPI.updateMoving(id, { approved: !item.approved });
                setMovings(movings.map(m => m.move_id === id ? { ...m, approved: !m.approved } : m));
            }
        } catch (error) { console.error(error); }
    };

    const handleStatusChange = async (id, type, newStatus) => {
        try {
            if (type === 'repair') {
                await repairAPI.updateRepair(id, { status: newStatus });
                setRepairs(repairs.map(r => r.id_repair === id ? { ...r, status: newStatus } : r));
            } else {
                await movingAPI.updateMoving(id, { status: newStatus });
                setMovings(movings.map(m => m.move_id === id ? { ...m, status: newStatus } : m));
            }
        } catch (error) { console.error(error); }
    };

    // User Edit Actions
    const handleEditUserClick = (userItem) => {
        setEditingUser(userItem);
        setEditFormData({
            name: userItem.name,
            lastname: userItem.lastname,
            email: userItem.email,
            phone: userItem.phone || '',
            position: userItem.position,
            password: '' // Don't verify old pass, just allow set new one
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload (remove empty password if not changed)
            const payload = { ...editFormData };
            if (!payload.password) delete payload.password;

            await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, payload);

            Swal.fire({
                icon: 'success',
                title: 'อัปเดตสำเร็จ',
                text: 'ข้อมูลผู้ใช้ถูกแก้ไขเรียบร้อยแล้ว',
                confirmButtonColor: '#8B4513'
            });
            setEditingUser(null);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Update user error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.response?.data?.message || error.message,
                confirmButtonColor: '#8B4513'
            });
        }
    };

    // Helpers
    const translateRepairType = (c) => ({ 'electric': 'ไฟฟ้า', 'plumbing': 'ประปา', 'aircon': 'เครื่องปรับอากาศ', 'furniture': 'เฟอร์นิเจอร์', 'computer': 'คอมพิวเตอร์' }[c] || c);
    const translateMovingType = (c) => ({ 'move': 'ขนย้ายอุปกรณ์', 'arrange': 'จัดสถานที่', 'setup': 'ติดตั้งอุปกรณ์' }[c] || c);
    const repairCounts = {
        pending: repairs.filter(i => i.status === 'pending').length,
        inProgress: repairs.filter(i => i.status === 'inProgress').length,
        completed: repairs.filter(i => i.status === 'completed').length
    };
    const movingCounts = {
        pending: movings.filter(i => i.status === 'pending').length,
        inProgress: movings.filter(i => i.status === 'inProgress').length,
        completed: movings.filter(i => i.status === 'completed').length
    };

    // Components
    const StatusCard = ({ count, title, iconPath }) => (
        <div className="bg-[#FDF3E6] border-2 border-[#E8D5C4] rounded-3xl p-6 relative flex flex-col items-center justify-center min-h-[160px] shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white border-2 border-[#C0C0C0] rounded-full flex items-center justify-center text-[#666666] font-bold shadow-sm text-lg">{count > 99 ? '99+' : count}</div>
            <div className="bg-white p-4 rounded-full shadow-sm mb-3"><svg className="w-10 h-10 text-[#4E2E16]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={iconPath} /></svg></div>
            <h3 className="text-xl font-medium text-[#4E2E16]">{title}</h3>
        </div>
    );

    if (loading) return <div className="min-h-screen bg-[#FDF6ED] flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B4513]"></div></div>;
    if (!user || user.position !== 'admin') return null;

    return (
        <div className="min-h-screen bg-[#FDF6ED]" style={{ fontFamily: "'Kanit', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap'); .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: #F8E9D6; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4B495; border-radius: 4px; }`}</style>

            {/* Image Popup */}
            {selectedImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh]"><img src={selectedImage} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white" /></div>
                </div>
            )}

            {/* EDIT USER POPUP MODAL */}
            {editingUser && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-[#E8D5C4] max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-[#4E2E16]">แก้ไขผู้ใช้งาน</h2>
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#8B6E47] mb-1">ชื่อ</label>
                                    <input type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-all" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#8B6E47] mb-1">นามสกุล</label>
                                    <input type="text" value={editFormData.lastname} onChange={e => setEditFormData({ ...editFormData, lastname: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-all" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8B6E47] mb-1">อีเมล</label>
                                <input type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-all bg-gray-50" readOnly title="แก้ไขไม่ได้" />
                                <p className="text-xs text-gray-400 mt-1">*อีเมลไม่สามารถแก้ไขได้</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8B6E47] mb-1">เบอร์โทรศัพท์</label>
                                <input type="tel" value={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8B6E47] mb-1">ตำแหน่ง / บทบาท</label>
                                <div className="relative">
                                    <select
                                        value={editFormData.position}
                                        onChange={e => setEditFormData({ ...editFormData, position: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-all appearance-none cursor-pointer bg-white"
                                    >
                                        <option value="student">นักศึกษา</option>
                                        <option value="teacher">อาจารย์</option>
                                        <option value="staff">บุคลากร</option>
                                        <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-dashed border-gray-200 mt-2">
                                <label className="block text-sm font-medium text-[#8B6E47] mb-1">เปลี่ยนรหัสผ่าน (ถ้าต้องการ)</label>
                                <input
                                    type="password"
                                    placeholder="กรอกรหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)"
                                    value={editFormData.password}
                                    onChange={e => setEditFormData({ ...editFormData, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-all"
                                    minLength={6}
                                />
                            </div>
                            <div className="flex gap-3 mt-8 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium">ยกเลิก</button>
                                <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-[#8B4513] text-white hover:bg-[#6d3610] transition-colors font-medium shadow-lg shadow-orange-900/20">บันทึกการแก้ไข</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Header */}
            <div className="md:hidden bg-[#8B4513] text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-40">
                <div className="flex items-center gap-3"><button onClick={() => setIsSidebarOpen(true)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button><h1 className="text-lg font-bold">Admin Panel</h1></div>
            </div>

            {/* Sidebar */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
            <div className={`fixed left-0 top-0 h-full w-64 bg-[#8B4513] shadow-xl z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8"><div className="bg-white/20 p-3 rounded-xl"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div><div><h1 className="text-xl font-bold text-white">Admin</h1><p className="text-white/70 text-xs">ระบบจัดการ</p></div></div>
                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'repairs', label: 'สถานะแจ้งซ่อม', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
                            { id: 'movings', label: 'สถานะขนย้าย', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
                            { id: 'users', label: 'จัดการผู้ใช้', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
                            { id: 'reports', label: 'รายงานสรุป', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
                        ].map(menu => (
                            <button key={menu.id} onClick={() => { setActiveMenu(menu.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === menu.id ? 'bg-white text-[#8B4513] shadow-lg scale-105' : 'text-white/80 hover:bg-white/10'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon} /></svg>
                                <span className="font-medium">{menu.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/20 mt-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><span className="text-white text-lg">👤</span></div>
                            <div className="overflow-hidden"><p className="text-white font-medium truncate">{user?.name}</p><p className="text-white/70 text-xs truncate">{user?.position}</p></div>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    Swal.fire({
                                        title: 'ยืนยันการออกจากระบบ?',
                                        text: "คุณต้องการออกจากระบบใช่หรือไม่?",
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#d33',
                                        cancelButtonColor: '#3085d6',
                                        confirmButtonText: 'ออกจากระบบ',
                                        cancelButtonText: 'ยกเลิก'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            // Use context logout to update global state
                                            logout();
                                            navigate('/login');
                                        }
                                    });
                                }}
                                className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 border border-red-500/30 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="transition-all duration-300 md:ml-64 p-4 md:p-8">
                <div className="mb-6 hidden md:block">
                    <h1 className="text-3xl font-bold text-[#4E2E16]">
                        {activeMenu === 'repairs' && 'บริการ - แจ้งซ่อม'}
                        {activeMenu === 'movings' && 'บริการ - ขนย้าย/จัดสถานที่'}
                        {activeMenu === 'users' && 'จัดการผู้ใช้'}
                        {activeMenu === 'reports' && 'รายงานสรุป (ประวัติทั้งหมด)'}
                    </h1>
                </div>

                {/* Image Lightbox Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
                            <img
                                src={selectedImage}
                                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white object-contain"
                                alt="Full size"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all">
                                ปิดขยายรูปภาพ
                            </button>
                        </div>
                    </div>
                )}

                {/* REPAIRS VIEW */}
                {activeMenu === 'repairs' && (
                    <div className="animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
                            <StatusCard count={repairCounts.pending} title="รออนุมัติงาน" iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            <StatusCard count={repairCounts.inProgress} title="กำลังดำเนินการ" iconPath="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            <StatusCard count={repairCounts.completed} title="เสร็จสิ้น" iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </div>
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8D5C4]">
                            <div className="bg-[#F8E9D6] px-6 py-4 border-b border-[#E8D5C4]"><h2 className="text-xl font-semibold text-[#4E2E16]">รายการแจ้งซ่อม</h2></div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                                <table className="w-full min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-[#FDF6ED]">
                                            <th className="px-6 py-4 text-left font-semibold text-[#4E2E16] w-28 whitespace-nowrap">รูป</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-32 whitespace-nowrap">สถานที่</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-32 whitespace-nowrap">งาน</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] min-w-[200px]">รายละเอียด</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-24">อนุมัติ</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-32">สถานะ</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-20">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {repairs.map((item, index) => (
                                            <tr key={item.id_repair} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#FDF6ED]/50'} hover:bg-orange-50/50`}>
                                                <td className="px-6 py-4"><div className="w-20 h-14 rounded-xl overflow-hidden cursor-zoom-in hover:scale-105 transition-all" onClick={() => setSelectedImage(item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=80&fit=crop")}><img src={item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=80&fit=crop"} className="w-full h-full object-cover" /></div></td>
                                                <td className="px-4 py-4 font-medium whitespace-nowrap">{item.location}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{translateRepairType(item.type_work)}</td>
                                                <td className="px-4 py-4 text-[#8B6E47] truncate max-w-xs">{item.detail}</td>
                                                <td className="px-4 py-4 text-center"><button onClick={() => handleApprovalToggle(item.id_repair, 'repair')} className={`w-14 h-7 flex items-center rounded-full p-1 mx-auto ${item.approved ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${item.approved ? 'translate-x-7' : 'translate-x-0'}`}></div></button></td>
                                                <td className="px-4 py-4"><select value={item.status} onChange={(e) => handleStatusChange(item.id_repair, 'repair', e.target.value)} className={`w-full px-3 py-1.5 rounded-full font-medium text-xs border-0 text-center ${item.status === 'completed' ? 'bg-green-500 text-white' : item.status === 'inProgress' ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-700'}`}><option value="pending">รออนุมัติ</option><option value="inProgress">ดำเนินการ</option><option value="completed">เสร็จสิ้น</option></select></td>
                                                <td className="px-4 py-4 text-center"><button onClick={() => handleDelete(item.id_repair, 'repair')} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors" title="ลบข้อมูล"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card List View */}
                            <div className="md:hidden space-y-4 p-4 bg-[#F9F5F1]">
                                {repairs.map((item) => (
                                    <div key={item.id_repair} className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFBF86]/30 flex flex-col gap-3">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-zoom-in shadow-sm" onClick={() => setSelectedImage(item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=80&fit=crop")}>
                                                <img src={item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=80&fit=crop"} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-[#4E2E16] truncate">{item.location}</h3>
                                                    <button onClick={() => handleDelete(item.id_repair, 'repair')} className="text-red-300 hover:text-red-500 -mt-1 -mr-1 p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                </div>
                                                <p className="text-sm font-medium text-[#8B4513] mb-1">{translateRepairType(item.type_work)}</p>
                                                <p className="text-sm text-gray-500 line-clamp-2">{item.detail}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-dashed border-[#EFBF86]/50 pt-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">อนุมัติ:</span>
                                                <button onClick={() => handleApprovalToggle(item.id_repair, 'repair')} className={`w-10 h-6 flex items-center rounded-full p-0.5 ${item.approved ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`bg-white w-5 h-5 rounded-full shadow-sm transform duration-300 ${item.approved ? 'translate-x-4' : 'translate-x-0'}`}></div></button>
                                            </div>
                                            <div className="flex-1">
                                                <select value={item.status} onChange={(e) => handleStatusChange(item.id_repair, 'repair', e.target.value)} className={`w-full px-2 py-1.5 rounded-lg font-medium text-xs border border-gray-100 text-center ${item.status === 'completed' ? 'bg-green-50 text-green-700' : item.status === 'inProgress' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'}`}><option value="pending">รออนุมัติ</option><option value="inProgress">กำลังดำเนินการ</option><option value="completed">เสร็จสิ้น</option></select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MOVINGS VIEW */}
                {activeMenu === 'movings' && (
                    <div className="animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
                            <StatusCard count={movingCounts.pending} title="รออนุมัติงาน" iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            <StatusCard count={movingCounts.inProgress} title="กำลังดำเนินการ" iconPath="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            <StatusCard count={movingCounts.completed} title="เสร็จสิ้น" iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </div>
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8D5C4]">
                            <div className="bg-[#F8E9D6] px-6 py-4 border-b border-[#E8D5C4]"><h2 className="text-xl font-semibold text-[#4E2E16]">สถานะขนย้าย</h2></div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                                <table className="w-full min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-[#FDF6ED]">
                                            <th className="px-6 py-4 text-left font-semibold text-[#4E2E16] w-28 whitespace-nowrap">รูป</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-32 whitespace-nowrap">สถานที่</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-32 whitespace-nowrap">งาน</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] min-w-[200px]">รายละเอียด</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-32">ผู้แจ้ง</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-24">อนุมัติ</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-32">สถานะ</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-20">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movings.map((item, index) => (
                                            <tr key={item.move_id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#FDF6ED]/50'} hover:bg-orange-50/50`}>
                                                <td className="px-6 py-4"><div className="w-20 h-14 rounded-xl overflow-hidden cursor-zoom-in hover:scale-105 transition-all" onClick={() => setSelectedImage(item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1600993463592-0f390e71b63f?w=100&h=80&fit=crop")}><img src={item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1600993463592-0f390e71b63f?w=100&h=80&fit=crop"} className="w-full h-full object-cover" /></div></td>
                                                <td className="px-4 py-4 font-medium whitespace-nowrap">{item.location}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{translateMovingType(item.type_work)}</td>
                                                <td className="px-4 py-4 text-[#8B6E47] truncate max-w-xs">{item.detail}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{item.user_name}</td>
                                                <td className="px-4 py-4 text-center"><button onClick={() => handleApprovalToggle(item.move_id, 'moving')} className={`w-14 h-7 flex items-center rounded-full p-1 mx-auto ${item.approved ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${item.approved ? 'translate-x-7' : 'translate-x-0'}`}></div></button></td>
                                                <td className="px-4 py-4"><select value={item.status} onChange={(e) => handleStatusChange(item.move_id, 'moving', e.target.value)} className={`w-full px-3 py-1.5 rounded-full font-medium text-xs border-0 text-center ${item.status === 'completed' ? 'bg-green-500 text-white' : item.status === 'inProgress' ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-700'}`}><option value="pending">รออนุมัติ</option><option value="inProgress">ดำเนินการ</option><option value="completed">เสร็จสิ้น</option></select></td>
                                                <td className="px-4 py-4 text-center"><button onClick={() => handleDelete(item.move_id, 'moving')} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors" title="ลบข้อมูล"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card List View */}
                            <div className="md:hidden space-y-4 p-4 bg-[#F9F5F1]">
                                {movings.map((item) => (
                                    <div key={item.move_id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFBF86]/30 flex flex-col gap-3">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-zoom-in shadow-sm" onClick={() => setSelectedImage(item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1600993463592-0f390e71b63f?w=100&h=80&fit=crop")}>
                                                <img src={item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1600993463592-0f390e71b63f?w=100&h=80&fit=crop"} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-[#4E2E16] truncate">{item.location}</h3>
                                                    <button onClick={() => handleDelete(item.move_id, 'moving')} className="text-red-300 hover:text-red-500 -mt-1 -mr-1 p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                </div>
                                                <p className="text-sm font-medium text-[#8B4513] mb-1">{translateMovingType(item.type_work)}</p>
                                                <p className="text-sm text-gray-500 line-clamp-2">{item.detail}</p>
                                                <p className="text-xs text-blue-500 mt-1">แจ้งโดย: {item.user_name}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-dashed border-[#EFBF86]/50 pt-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">อนุมัติ:</span>
                                                <button onClick={() => handleApprovalToggle(item.move_id, 'moving')} className={`w-10 h-6 flex items-center rounded-full p-0.5 ${item.approved ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`bg-white w-5 h-5 rounded-full shadow-sm transform duration-300 ${item.approved ? 'translate-x-4' : 'translate-x-0'}`}></div></button>
                                            </div>
                                            <div className="flex-1">
                                                <select value={item.status} onChange={(e) => handleStatusChange(item.move_id, 'moving', e.target.value)} className={`w-full px-2 py-1.5 rounded-lg font-medium text-xs border border-gray-100 text-center ${item.status === 'completed' ? 'bg-green-50 text-green-700' : item.status === 'inProgress' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'}`}><option value="pending">รออนุมัติ</option><option value="inProgress">กำลังดำเนินการ</option><option value="completed">เสร็จสิ้น</option></select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* REPORTS VIEW */}
                {activeMenu === 'reports' && (
                    <div className="animate-fade-in-up">
                        {/* Tab Switcher */}
                        <div className="flex p-1 bg-gray-100/80 rounded-xl mb-6 w-full md:w-auto inline-flex overflow-hidden">
                            <button
                                onClick={() => setReportTab('repairs')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${reportTab === 'repairs' ? 'bg-white text-[#8B4513] shadow-md' : 'text-gray-500 hover:text-[#8B4513]'}`}
                            >
                                📋 ประวัติการแจ้งซ่อม
                            </button>
                            <button
                                onClick={() => setReportTab('movings')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${reportTab === 'movings' ? 'bg-white text-[#8B4513] shadow-md' : 'text-gray-500 hover:text-[#8B4513]'}`}
                            >
                                🚚 ประวัติการขนย้าย
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8D5C4]">
                            <div className="bg-[#F8E9D6] px-6 py-4 border-b border-[#E8D5C4] flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-[#4E2E16]">
                                    {reportTab === 'repairs' ? 'รายงานประวัติการแจ้งซ่อมทั้งหมด' : 'รายงานประวัติการขนย้ายทั้งหมด'}
                                </h2>
                                <span className="bg-[#E8D5C4] text-[#8B4513] text-xs font-bold px-2 py-1 rounded-full">
                                    {(reportTab === 'repairs' ? reportRepairs : reportMovings).length} รายการ
                                </span>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                                <table className="w-full min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-[#FDF6ED]">
                                            <th className="px-6 py-4 text-left font-semibold text-[#4E2E16] w-24">ID</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-32">วันที่แจ้ง</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16] w-48">สถานที่</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16]">งาน</th>
                                            <th className="px-4 py-4 text-left font-semibold text-[#4E2E16]">ผู้แจ้ง</th>
                                            <th className="px-4 py-4 text-center font-semibold text-[#4E2E16] w-32">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(reportTab === 'repairs' ? reportRepairs : reportMovings).map((item, index) => (
                                            <tr key={index} className={`border-b border-gray-100 ${item.status === 'deleted' ? 'bg-red-50/50' : (index % 2 === 0 ? 'bg-white' : 'bg-[#FDF6ED]/50')} hover:bg-orange-50/30`}>
                                                <td className="px-6 py-4 text-[#8B6E47] font-mono">#{item.id_repair || item.move_id}</td>
                                                <td className="px-4 py-4 text-sm text-[#4E2E16]">{new Date(item.created_at).toLocaleDateString('th-TH')}</td>
                                                <td className="px-4 py-4 font-medium text-[#4E2E16]">{item.location}</td>
                                                <td className="px-4 py-4 text-[#4E2E16]">{reportTab === 'repairs' ? translateRepairType(item.type_work) : translateMovingType(item.type_work)}</td>
                                                <td className="px-4 py-4 text-[#4E2E16] flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#F3D9B0] text-[#8B4513] flex items-center justify-center text-xs font-bold">
                                                        {item.user_name ? item.user_name.charAt(0) : '?'}
                                                    </div>
                                                    {item.user_name}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {item.status === 'deleted' ? (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-200">ลบแล้ว</span>
                                                    ) : (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${item.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                                            {item.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout */}
                            <div className="md:hidden bg-[#F9F5F1] p-4 space-y-3">
                                {(reportTab === 'repairs' ? reportRepairs : reportMovings).map((item, index) => (
                                    <div key={index} className={`bg-white rounded-xl shadow-sm border p-4 ${item.status === 'deleted' ? 'border-red-200 bg-red-50/30' : 'border-[#EFBF86]/30'}`}>
                                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-dashed border-gray-100">
                                            <span className="font-mono text-xs text-[#8B6E47] bg-[#FDF6ED] px-2 py-0.5 rounded">#{item.id_repair || item.move_id}</span>
                                            <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('th-TH')}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            {/* Icon Placeholder based on Type */}
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F8E9D6] text-[#8B4513]">
                                                {reportTab === 'repairs' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m2 2a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-[#4E2E16] text-sm">{item.location}</h4>
                                                <p className="text-xs text-[#8B4513] mt-0.5">{reportTab === 'repairs' ? translateRepairType(item.type_work) : translateMovingType(item.type_work)}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <span>👤 {item.user_name}</span>
                                                    </div>
                                                    <div>
                                                        {item.status === 'deleted' ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-600">ลบแล้ว</span>
                                                        ) : (
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                                {item.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* USERS VIEW */}
                {activeMenu === 'users' && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8D5C4] animate-fade-in-up">
                        <div className="bg-[#F8E9D6] px-6 py-4 border-b border-[#E8D5C4] flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-[#4E2E16]">รายชื่อผู้ใช้งาน</h2>
                            <div className="bg-[#E8D5C4] px-4 py-2 rounded-full"><span className="text-[#8B4513] font-bold">ทั้งหมด {users.length} คน</span></div>
                        </div>
                        <div className="hidden md:block overflow-x-auto custom-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#FDF6ED]">
                                        <th className="px-6 py-4 text-left font-semibold text-[#4E2E16]">ID</th>
                                        <th className="px-4 py-4 text-left font-semibold text-[#4E2E16]">ชื่อ-นามสกุล</th>
                                        <th className="px-4 py-4 text-left font-semibold text-[#4E2E16]">อีเมล</th>
                                        <th className="px-4 py-4 text-left font-semibold text-[#4E2E16]">ตำแหน่ง</th>
                                        <th className="px-4 py-4 text-center font-semibold text-[#4E2E16]">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userItem, index) => (
                                        <tr key={userItem.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#FDF6ED]/50'} hover:bg-blue-50/50`}>
                                            <td className="px-6 py-4 text-[#4E2E16]">#{userItem.id}</td>
                                            <td className="px-4 py-4 text-[#4E2E16] font-medium">{userItem.name} {userItem.lastname}</td>
                                            <td className="px-4 py-4 text-[#8B6E47]">{userItem.email}</td>
                                            <td className="px-4 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${userItem.position === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{userItem.position || 'ผู้ใช้งาน'}</span></td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => handleEditUserClick(userItem)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8B4513] hover:bg-[#6d3610] text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    แก้ไข
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile User Card */}
                        <div className="md:hidden p-4 space-y-3 bg-gray-50">
                            {users.map((userItem) => (
                                <div key={userItem.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${userItem.position === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{userItem.name.charAt(0)}</div>
                                        <div>
                                            <h3 className="font-bold text-[#4E2E16]">{userItem.name} {userItem.lastname}</h3>
                                            <p className="text-xs text-[#8B6E47]">{userItem.email}</p>
                                            <span className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium inline-block ${userItem.position === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>{userItem.position || 'ผู้ใช้งาน'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEditUserClick(userItem)}
                                            className="p-2 bg-gray-100 rounded-lg text-[#8B4513] hover:bg-gray-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
