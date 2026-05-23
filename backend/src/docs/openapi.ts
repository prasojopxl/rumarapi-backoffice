const jsonResponse = (description: string, example: any) => ({
  description,
  content: {
    "application/json": {
      example,
    },
  },
})

const crudPathWithId = (
  tag: string,
  resourceLabel: string,
  schemaCreate: string,
  schemaUpdate: string,
  authDescription: string,
) => ({
  "/": {
    get: {
      tags: [tag],
      summary: `Get all ${resourceLabel}`,
      description: authDescription,
      security: [{ bearerAuth: [] }],
      responses: {
        "200": jsonResponse("Success", {
          data: [{ id: "uuid", message: `${resourceLabel} list` }],
        }),
        "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
      },
    },
    post: {
      tags: [tag],
      summary: `Create ${resourceLabel.slice(0, -1)}`,
      description: authDescription,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: `#/components/schemas/${schemaCreate}` },
          },
        },
      },
      responses: {
        "201": jsonResponse("Created", {
          id: "uuid",
          message: `${resourceLabel.slice(0, -1)} created`,
        }),
        "400": jsonResponse("Bad request", { message: "Validation error" }),
        "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
      },
    },
  },
  "/{id}": {
    get: {
      tags: [tag],
      summary: `Get ${resourceLabel.slice(0, -1)} by id`,
      description: authDescription,
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        "200": jsonResponse("Success", {
          id: "uuid",
          message: `${resourceLabel.slice(0, -1)} detail`,
        }),
        "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        "404": jsonResponse("Not found", { message: `${resourceLabel.slice(0, -1)} not found` }),
      },
    },
    put: {
      tags: [tag],
      summary: `Update ${resourceLabel.slice(0, -1)}`,
      description: authDescription,
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: `#/components/schemas/${schemaUpdate}` },
          },
        },
      },
      responses: {
        "200": jsonResponse("Success", {
          id: "uuid",
          message: `${resourceLabel.slice(0, -1)} updated`,
        }),
        "400": jsonResponse("Bad request", { message: "Validation error" }),
        "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        "404": jsonResponse("Not found", { message: `${resourceLabel.slice(0, -1)} not found` }),
      },
    },
    delete: {
      tags: [tag],
      summary: `Delete ${resourceLabel.slice(0, -1)}`,
      description: authDescription,
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        "200": jsonResponse("Success", { message: `${resourceLabel.slice(0, -1)} deleted successfully` }),
        "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        "404": jsonResponse("Not found", { message: `${resourceLabel.slice(0, -1)} not found` }),
      },
    },
  },
})

const authDescription = "Requires user JWT Bearer token from /auth/login."

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "TypeCMS API",
    version: "1.2.0",
    description: "Complete Swagger docs with required fields, example responses, and synchronized security rules.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [
    { name: "System" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Images" },
    { name: "Mail" },
    { name: "Categories" },
    { name: "Roles" },
    { name: "Posts" },
    { name: "Products" },
    { name: "Settings" },
    { name: "Tags" },
    { name: "Taggables" },
    { name: "Banner Positions" },
    { name: "Banners" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "User JWT token",
      },
      apiBearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "API token with scope from /auth/token",
      },
    },
    parameters: {
      IdParam: { in: "path", name: "id", required: true, schema: { type: "string" } },
      KeyParam: { in: "path", name: "key", required: true, schema: { type: "string" } },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["userName", "password"],
        properties: { userName: { type: "string" }, password: { type: "string" } },
      },
      CreateApiTokenRequest: {
        type: "object",
        required: ["clientKey", "scope"],
        properties: {
          clientKey: { type: "string", description: "Must be API_TOKEN_ISSUER_KEY" },
          name: { type: "string" },
          scope: { type: "array", items: { type: "string" } },
          expiresPresetDays: { type: "number", enum: [30, 90] },
          expiresInHours: { type: "number" },
        },
      },
      UpdateApiTokenScopeRequest: {
        type: "object",
        required: ["clientKey", "scope"],
        properties: {
          clientKey: { type: "string" },
          scope: { type: "array", items: { type: "string" } },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["fullName", "userName", "email", "roleId", "password"],
        properties: {
          fullName: { type: "string" },
          userName: { type: "string" },
          email: { type: "string", format: "email" },
          roleId: { type: "string" },
          password: { type: "string" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          userName: { type: "string" },
          email: { type: "string", format: "email" },
          roleId: { type: "string" },
        },
      },
      UpdateMeRequest: {
        type: "object",
        properties: { fullName: { type: "string" }, password: { type: "string" } },
      },
      SendMailRequest: {
        type: "object",
        required: ["subject", "to", "message"],
        properties: {
          subject: { type: "string" },
          to: { type: "string", format: "email" },
          message: { type: "string" },
        },
      },
      CategoryCreateRequest: {
        type: "object",
        required: ["name", "slug"],
        properties: { name: { type: "string" }, slug: { type: "string" }, description: { type: "string", nullable: true } },
      },
      CategoryUpdateRequest: { type: "object", properties: { name: { type: "string" }, slug: { type: "string" }, description: { type: "string", nullable: true } } },
      RoleCreateRequest: { type: "object", required: ["name"], properties: { name: { type: "string" } } },
      RoleUpdateRequest: { type: "object", properties: { name: { type: "string" } } },
      PostCreateRequest: {
        type: "object",
        required: ["authorId", "title", "slug", "content"],
        properties: {
          authorId: { type: "string" },
          featuredImageId: { type: "string", nullable: true },
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          type: { type: "string" },
          status: { type: "string" },
        },
      },
      PostUpdateRequest: {
        type: "object",
        properties: {
          authorId: { type: "string" },
          featuredImageId: { type: "string", nullable: true },
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          type: { type: "string" },
          status: { type: "string" },
        },
      },
      ProductCreateRequest: {
        type: "object",
        required: ["name", "slug", "price"],
        properties: {
          categoryId: { type: "string", nullable: true },
          thumbnailId: { type: "string", nullable: true },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          price: { type: "number" },
          stock: { type: "number" },
          status: { type: "string" },
        },
      },
      ProductUpdateRequest: {
        type: "object",
        properties: {
          categoryId: { type: "string", nullable: true },
          thumbnailId: { type: "string", nullable: true },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          price: { type: "number" },
          stock: { type: "number" },
          status: { type: "string" },
        },
      },
      SettingCreateRequest: {
        type: "object",
        required: ["key", "value"],
        properties: { key: { type: "string" }, value: { type: "string" }, siteName: { type: "string", nullable: true } },
      },
      SettingUpdateRequest: { type: "object", properties: { value: { type: "string" }, siteName: { type: "string", nullable: true } } },
      TagCreateRequest: { type: "object", required: ["name", "slug"], properties: { name: { type: "string" }, slug: { type: "string" } } },
      TagUpdateRequest: { type: "object", properties: { name: { type: "string" }, slug: { type: "string" } } },
      TaggableCreateRequest: {
        type: "object",
        required: ["tagId", "relatableId", "relatableType"],
        properties: {
          tagId: { type: "string" },
          relatableId: { type: "string" },
          relatableType: { type: "string", enum: ["POST", "PRODUCT"] },
        },
      },
      TaggableUpdateRequest: { type: "object", properties: { tagId: { type: "string" }, relatableId: { type: "string" }, relatableType: { type: "string", enum: ["POST", "PRODUCT"] } } },
      BannerPositionCreateRequest: { type: "object", required: ["name", "slug"], properties: { name: { type: "string" }, slug: { type: "string" }, status: { type: "string" } } },
      BannerPositionUpdateRequest: { type: "object", properties: { name: { type: "string" }, slug: { type: "string" }, status: { type: "string" } } },
      BannerCreateRequest: {
        type: "object",
        required: ["positionId"],
        properties: {
          positionId: { type: "string" },
          mediaId: { type: "string", nullable: true },
          title: { type: "string", nullable: true },
          subTitle: { type: "string", nullable: true },
          linkUrl: { type: "string", nullable: true },
          orderPriority: { type: "number" },
          isActive: { type: "boolean" },
          startDate: { type: "string", format: "date-time", nullable: true },
          endDate: { type: "string", format: "date-time", nullable: true },
        },
      },
      BannerUpdateRequest: {
        type: "object",
        properties: {
          positionId: { type: "string" },
          mediaId: { type: "string", nullable: true },
          title: { type: "string", nullable: true },
          subTitle: { type: "string", nullable: true },
          linkUrl: { type: "string", nullable: true },
          orderPriority: { type: "number" },
          isActive: { type: "boolean" },
          startDate: { type: "string", format: "date-time", nullable: true },
          endDate: { type: "string", format: "date-time", nullable: true },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["System"],
        summary: "Welcome endpoint",
        responses: { "200": jsonResponse("Success", { message: "Welcome APP !!!" }) },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description: "Public endpoint. Use this token for user-protected APIs.",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } },
        responses: {
          "200": jsonResponse("Success", { message: "Login successfully", name: "Admin", token: "jwt-token" }),
          "400": jsonResponse("Bad request", { message: "Wrong password" }),
        },
      },
    },
    "/auth/token": {
      get: {
        tags: ["Auth"],
        summary: "Get all API tokens",
        description: "Requires query clientKey = API_TOKEN_ISSUER_KEY.",
        parameters: [
          { in: "query", name: "clientKey", required: true, schema: { type: "string" } },
          { in: "query", name: "includeInactive", required: false, schema: { type: "boolean", default: false } },
        ],
        responses: {
          "200": jsonResponse("Success", { message: "API tokens fetched", total: 1, data: [{ id: "uuid", name: "Public reader", scopes: ["images:read"], isActive: true, expiresAt: null, createdAt: "2026-05-19T08:00:00.000Z", updatedAt: "2026-05-19T08:00:00.000Z" }] }),
          "401": jsonResponse("Unauthorized", { message: "Invalid client key" }),
        },
      },
      post: {
        tags: ["Auth"],
        summary: "Create API token",
        description: "Requires clientKey in request body.",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateApiTokenRequest" } } } },
        responses: {
          "201": jsonResponse("Created", { message: "API token created", token: "jwt-api-token", tokenId: "uuid", scope: ["images:read"], expiresAt: null, expiresInHours: null }),
          "400": jsonResponse("Bad request", { message: "\"scope\" is required" }),
          "401": jsonResponse("Unauthorized", { message: "Invalid client key" }),
        },
      },
    },
    "/auth/token/{id}/scope": {
      patch: {
        tags: ["Auth"],
        summary: "Update API token scope",
        description: "Requires clientKey in request body.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateApiTokenScopeRequest" } } } },
        responses: {
          "200": jsonResponse("Success", { message: "API token scope updated", tokenId: "uuid", scope: ["images:read", "categories:read"], expiresAt: null }),
          "401": jsonResponse("Unauthorized", { message: "Invalid client key" }),
          "404": jsonResponse("Not found", { message: "Record to update not found." }),
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        responses: {
          "200": jsonResponse("Success", [{ id: "uuid", fullName: "Admin", userName: "admin", email: "admin@mail.com", role: { id: "role-uuid", name: "admin" } }]),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        description: "Public endpoint for registration (current implementation).",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } } },
        responses: {
          "200": jsonResponse("Success", { message: "User admin created successfully" }),
          "400": jsonResponse("Bad request", { message: "User already exists" }),
        },
      },
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get my profile",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        responses: { "200": jsonResponse("Success", { id: "uuid", fullName: "Admin", userName: "admin", email: "admin@mail.com" }), "401": jsonResponse("Unauthorized", { message: "Unauthorized" }) },
      },
      put: {
        tags: ["Users"],
        summary: "Update my profile",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateMeRequest" } } } },
        responses: { "200": jsonResponse("Success", { message: "User updated successfully" }), "401": jsonResponse("Unauthorized", { message: "Unauthorized" }) },
      },
    },
    "/users/{id}": {
      ...crudPathWithId("Users", "users", "CreateUserRequest", "UpdateUserRequest", authDescription)["/{id}"],
    },
    "/images": {
      get: {
        tags: ["Images"],
        summary: "Get images",
        description: "Requires API token Bearer with scope images:read.",
        security: [{ apiBearerAuth: [] }],
        responses: {
          "200": jsonResponse("Success", [{ id: "uuid", filename: "hero.jpg", filePath: "/public/image123.jpg", fileType: "image/jpeg", fileSize: 102030 }]),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
          "403": jsonResponse("Forbidden", { message: "Insufficient scope" }),
        },
      },
      post: {
        tags: ["Images"],
        summary: "Upload image",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["files"],
                properties: { files: { type: "array", items: { type: "string", format: "binary" } } },
              },
            },
          },
        },
        responses: {
          "201": jsonResponse("Created", { message: "Image upload successfully", data: { title: "hero.jpg", url: "/public/image123.jpg", mimetype: "image/jpeg" } }),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        },
      },
    },
    "/images/{id}": {
      get: {
        tags: ["Images"],
        summary: "Get image by id",
        description: "Requires API token Bearer with scope images:read.",
        security: [{ apiBearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": jsonResponse("Success", { id: "uuid", filename: "hero.jpg", filePath: "/public/image123.jpg" }),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
          "403": jsonResponse("Forbidden", { message: "Insufficient scope" }),
          "404": jsonResponse("Not found", { message: "Image not found" }),
        },
      },
    },
    "/mail": {
      get: {
        tags: ["Mail"],
        summary: "Mail test",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        responses: { "200": jsonResponse("Success", { message: "sendMail" }), "401": jsonResponse("Unauthorized", { message: "Unauthorized" }) },
      },
      post: {
        tags: ["Mail"],
        summary: "Send mail",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SendMailRequest" } } } },
        responses: { "200": jsonResponse("Success", { message: "Email sent successfully", message_id: "<message-id>" }), "401": jsonResponse("Unauthorized", { message: "Unauthorized" }) },
      },
    },
    "/categories": crudPathWithId("Categories", "categories", "CategoryCreateRequest", "CategoryUpdateRequest", authDescription)["/"],
    "/categories/{id}": crudPathWithId("Categories", "categories", "CategoryCreateRequest", "CategoryUpdateRequest", authDescription)["/{id}"],
    "/roles": crudPathWithId("Roles", "roles", "RoleCreateRequest", "RoleUpdateRequest", authDescription)["/"],
    "/roles/{id}": crudPathWithId("Roles", "roles", "RoleCreateRequest", "RoleUpdateRequest", authDescription)["/{id}"],
    "/posts": crudPathWithId("Posts", "posts", "PostCreateRequest", "PostUpdateRequest", authDescription)["/"],
    "/posts/{id}": crudPathWithId("Posts", "posts", "PostCreateRequest", "PostUpdateRequest", authDescription)["/{id}"],
    "/products": crudPathWithId("Products", "products", "ProductCreateRequest", "ProductUpdateRequest", authDescription)["/"],
    "/products/{id}": crudPathWithId("Products", "products", "ProductCreateRequest", "ProductUpdateRequest", authDescription)["/{id}"],
    "/tags": crudPathWithId("Tags", "tags", "TagCreateRequest", "TagUpdateRequest", authDescription)["/"],
    "/tags/{id}": crudPathWithId("Tags", "tags", "TagCreateRequest", "TagUpdateRequest", authDescription)["/{id}"],
    "/taggables": crudPathWithId("Taggables", "taggables", "TaggableCreateRequest", "TaggableUpdateRequest", authDescription)["/"],
    "/taggables/{id}": crudPathWithId("Taggables", "taggables", "TaggableCreateRequest", "TaggableUpdateRequest", authDescription)["/{id}"],
    "/banner-positions": crudPathWithId("Banner Positions", "banner positions", "BannerPositionCreateRequest", "BannerPositionUpdateRequest", authDescription)["/"],
    "/banner-positions/{id}": crudPathWithId("Banner Positions", "banner positions", "BannerPositionCreateRequest", "BannerPositionUpdateRequest", authDescription)["/{id}"],
    "/banners": crudPathWithId("Banners", "banners", "BannerCreateRequest", "BannerUpdateRequest", authDescription)["/"],
    "/banners/{id}": crudPathWithId("Banners", "banners", "BannerCreateRequest", "BannerUpdateRequest", authDescription)["/{id}"],
    "/settings": {
      get: {
        tags: ["Settings"],
        summary: "Get all settings",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        responses: {
          "200": jsonResponse("Success", [{ key: "site_title", value: "TypeCMS", siteName: "TypeCMS" }]),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        },
      },
      post: {
        tags: ["Settings"],
        summary: "Create setting",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SettingCreateRequest" } } } },
        responses: {
          "201": jsonResponse("Created", { key: "site_title", value: "TypeCMS", siteName: "TypeCMS" }),
          "400": jsonResponse("Bad request", { message: "Validation error" }),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
        },
      },
    },
    "/settings/{key}": {
      get: {
        tags: ["Settings"],
        summary: "Get setting by key",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/KeyParam" }],
        responses: {
          "200": jsonResponse("Success", { key: "site_title", value: "TypeCMS", siteName: "TypeCMS" }),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
          "404": jsonResponse("Not found", { message: "Setting not found" }),
        },
      },
      put: {
        tags: ["Settings"],
        summary: "Update setting by key",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/KeyParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SettingUpdateRequest" } } } },
        responses: {
          "200": jsonResponse("Success", { key: "site_title", value: "TypeCMS Updated", siteName: "TypeCMS" }),
          "400": jsonResponse("Bad request", { message: "Validation error" }),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
          "404": jsonResponse("Not found", { message: "Setting not found" }),
        },
      },
      delete: {
        tags: ["Settings"],
        summary: "Delete setting by key",
        description: authDescription,
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/KeyParam" }],
        responses: {
          "200": jsonResponse("Success", { message: "Setting site_title deleted successfully" }),
          "401": jsonResponse("Unauthorized", { message: "Unauthorized" }),
          "404": jsonResponse("Not found", { message: "Setting not found" }),
        },
      },
    },
  },
}

export default openApiSpec
