import React from 'react';
import '../stylesheet/pages/admin-page.css';
import Admin from '../components/layout/Admin';
import AdminGuard from '../components/admin/AdminGuard';

function AdminPage() {
    return (
        <main>
            <AdminGuard>
                <Admin />
            </AdminGuard>
        </main>
    )
}

export default AdminPage