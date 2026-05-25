export const TOKEN_KEY = "typecms_admin_token";

export type AuthUser = {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  roleId: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  type?: string | null;
  status?: string | null;
  authorId: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId?: string | null;
  thumbnailId?: string | null;
  price: number;
  stock?: number | null;
  status?: string | null;
};

export type ImageItem = {
  id: string;
  filename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt?: string;
};

export type RoleItem = {
  id: string;
  name: string;
};

export type UserItem = {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  roleId?: string;
  role?: {
    id: string;
    name: string;
  } | null;
  posts?: Array<{ id: string }>;
  createdAt?: string;
};

type ApiErrorPayload = {
  message?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? ((await response.json()) as T | ApiErrorPayload) : null;

  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload
      ? String((payload as ApiErrorPayload).message || "Request failed")
      : "Request failed";
    throw new Error(message);
  }

  return (payload as T) ?? ({} as T);
}

function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? ({ Authorization: `Bearer ${token}` } as HeadersInit) : ({} as HeadersInit);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(credentials: { userName: string; password: string }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await parseResponse<{ token: string; name?: string; message?: string }>(response);
  localStorage.setItem(TOKEN_KEY, result.token);
  return result;
}

export async function getMe() {
  const response = await fetch("/api/users/me", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<AuthUser>(response);
}

export async function getCategories() {
  const response = await fetch("/api/categories", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<Category[]>(response);
}

export async function createCategory(payload: { name: string; slug: string; description?: string }) {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse<Category>(response);
}

export async function getPosts() {
  const response = await fetch("/api/posts", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<Post[]>(response);
}

export async function createPost(payload: {
  authorId: string;
  title: string;
  slug: string;
  content: string;
  featuredImageId?: string;
  type?: string;
  status?: string;
}) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse<Post>(response);
}

export async function getProducts() {
  const response = await fetch("/api/products", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<Product[]>(response);
}

export async function createProduct(payload: {
  categoryId?: string;
  thumbnailId?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock?: number;
  status?: string;
}) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse<Product>(response);
}

export async function getImages() {
  const response = await fetch("/api/images", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<ImageItem[]>(response);
}

export async function getRoles() {
  const response = await fetch("/api/roles", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<RoleItem[]>(response);
}

export async function getUsers() {
  const response = await fetch("/api/users", {
    headers: {
      ...getAuthHeader(),
    },
  });
  return parseResponse<UserItem[]>(response);
}

export async function createUser(payload: {
  fullName: string;
  userName: string;
  email: string;
  roleId: string;
  password: string;
}) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse<{ message: string }>(response);
}

export async function updateUser(
  userId: string,
  payload: {
    fullName?: string;
    userName?: string;
    email?: string;
    roleId?: string;
  },
) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse<UserItem>(response);
}

export async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/images", {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body,
  });

  return parseResponse<{
    message: string;
    data: {
      title: string;
      url: string;
      mimetype: string;
    };
  }>(response);
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
