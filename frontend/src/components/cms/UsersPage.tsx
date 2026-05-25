import { Edit, Plus, RefreshCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createUser,
  getRoles,
  getUsers,
  updateUser,
  type RoleItem,
  type UserItem,
} from "../../lib/api";

const PAGE_SIZE = 8;

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString();
}

type UserFormState = {
  fullName: string;
  userName: string;
  email: string;
  roleId: string;
  password: string;
};

const initialForm: UserFormState = {
  fullName: "",
  userName: "",
  email: "",
  roleId: "",
  password: "",
};

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [createForm, setCreateForm] = useState<UserFormState>(initialForm);
  const [editForm, setEditForm] = useState<UserFormState>(initialForm);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
      if (!createForm.roleId && rolesData[0]?.id) {
        setCreateForm((prev) => ({ ...prev, roleId: rolesData[0].id }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal load data users";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchQuery.toLowerCase();
    return users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(keyword) ||
        user.userName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.role?.name || "").toLowerCase().includes(keyword)
      );
    });
  }, [users, searchQuery]);

  const roleStats = useMemo(() => {
    const map = new Map<string, number>();
    users.forEach((user) => {
      const key = user.role?.name || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFeedback("");

    try {
      const result = await createUser(createForm);
      setFeedback(result.message || "User berhasil dibuat");
      setCreateForm({
        ...initialForm,
        roleId: roles[0]?.id || "",
      });
      setShowCreateForm(false);
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal create user";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function openEditForm(user: UserItem) {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      roleId: user.role?.id || user.roleId || roles[0]?.id || "",
      password: "",
    });
    setShowEditForm(true);
  }

  async function handleUpdateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) {
      return;
    }

    setSubmitting(true);
    setError("");
    setFeedback("");

    try {
      await updateUser(selectedUser.id, {
        fullName: editForm.fullName,
        userName: editForm.userName,
        email: editForm.email,
        roleId: editForm.roleId,
      });
      setFeedback("User berhasil diupdate");
      setShowEditForm(false);
      setSelectedUser(null);
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal update user";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 text-muted-foreground">Kelola user CMS: list, create, dan edit data pengguna.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(true);
              setShowEditForm(false);
              setError("");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {feedback ? <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{feedback}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <h3 className="text-2xl font-semibold text-foreground">{users.length}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Roles</p>
          <h3 className="text-2xl font-semibold text-foreground">{roles.length}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Users With Posts</p>
          <h3 className="text-2xl font-semibold text-foreground">
            {users.filter((item) => (item.posts?.length || 0) > 0).length}
          </h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Posts By Users</p>
          <h3 className="text-2xl font-semibold text-foreground">
            {users.reduce((sum, item) => sum + (item.posts?.length || 0), 0)}
          </h3>
        </div>
      </div>

      {showCreateForm ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Create User</h2>
            <button type="button" onClick={() => setShowCreateForm(false)} className="rounded-md p-1 hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Full Name"
              value={createForm.fullName}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, fullName: event.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Username"
              value={createForm.userName}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, userName: event.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Email"
              type="email"
              value={createForm.email}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <select
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              value={createForm.roleId}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, roleId: event.target.value }))}
              required
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2 md:col-span-2"
              placeholder="Password"
              type="password"
              value={createForm.password}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Create User"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {showEditForm && selectedUser ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Edit User</h2>
            <button
              type="button"
              onClick={() => {
                setShowEditForm(false);
                setSelectedUser(null);
              }}
              className="rounded-md p-1 hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleUpdateUser} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Full Name"
              value={editForm.fullName}
              onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Username"
              value={editForm.userName}
              onChange={(event) => setEditForm((prev) => ({ ...prev, userName: event.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Email"
              type="email"
              value={editForm.email}
              onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <select
              className="rounded-lg border border-border bg-input-background px-4 py-2"
              value={editForm.roleId}
              onChange={(event) => setEditForm((prev) => ({ ...prev, roleId: event.target.value }))}
              required
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Update User"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-4 border-b border-border p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-transparent bg-input-background py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-sm text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-sm text-muted-foreground">
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-accent/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{user.fullName}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{user.userName}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{user.role?.name || "Unknown"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{user.posts?.length || 0}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => openEditForm(user)}
                        className="rounded-lg p-2 transition-colors hover:bg-accent"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + (paginatedUsers.length > 0 ? 1 : 0)}-
            {(page - 1) * PAGE_SIZE + paginatedUsers.length} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-md border border-border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-3 text-lg font-semibold text-foreground">Role Distribution</h3>
        <div className="flex flex-wrap gap-2">
          {roleStats.map(([roleName, total]) => (
            <span key={roleName} className="rounded-full bg-accent px-3 py-1 text-sm text-foreground">
              {roleName}: {total}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
