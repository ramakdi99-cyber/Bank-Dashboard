import React, { useEffect, useState, useCallback } from 'react';
import { Users, Shield } from 'lucide-react';
import { userApi } from '../services/api';
import { User as UserType } from '../types';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll({
        page: pagination.pagination.page,
        size: pagination.pagination.size,
        search: debouncedSearch || undefined,
      });
      setUsers(response.content);
      pagination.setTotal(response.totalElements, response.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.pagination.page, pagination.pagination.size, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    pagination.setPage(0);
  }, [debouncedSearch]);

  const handleRoleUpdate = async () => {
    if (!selectedUser || !newRole) return;
    setUpdating(true);
    try {
      await userApi.updateRole(selectedUser.id, newRole);
      toast.success('User role updated successfully');
      setEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      toast.error('Failed to update user role');
    } finally {
      setUpdating(false);
    }
  };

  const openRoleModal = (user: UserType) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditModalOpen(true);
  };

  const columns: Column<UserType>[] = [
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-navy-600">{user.username}</p>
            <p className="text-xs text-steel-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'fullName',
      header: 'Full Name',
      sortable: true,
      render: (user) => (
        <span className="text-steel-700">{user.firstName} {user.lastName}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => <StatusBadge value={user.role} variant="default" />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (user) => <span className="text-steel-500 text-sm">{formatDate(user.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openRoleModal(user); }}>
          <Shield className="h-4 w-4" />
          Change Role
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-600">User Management</h1>
        <p className="text-sm text-steel-500 mt-1">Manage user roles and permissions</p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        keyExtractor={(item) => item.id}
        pagination={{
          page: pagination.pagination.page,
          totalPages: pagination.pagination.totalPages,
          totalElements: pagination.pagination.totalElements,
          onPageChange: pagination.setPage,
        }}
        emptyMessage="No users found."
        emptyTitle="No Users"
      />

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Update User Role" size="sm">
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-steel-600">
              Update role for <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
            </p>
            <Select
              label="Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              options={[
                { value: 'ADMIN', label: 'Administrator' },
                { value: 'MANAGER', label: 'Manager' },
                { value: 'VIEWER', label: 'Viewer' },
              ]}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRoleUpdate} loading={updating}>
                Update Role
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
