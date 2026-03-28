import { resolveRoleHomePath } from "../constants/roles";
import type { RoleName } from "../types/auth";

type RouteMetaLike = {
  public?: boolean;
  roles?: RoleName[];
};

type RouteLike = {
  path: string;
  fullPath: string;
  meta: RouteMetaLike;
};

type AuthStoreLike = {
  initialized: boolean;
  isAuthenticated: boolean;
  roles: RoleName[];
  initialize: () => Promise<void>;
};

export const resolveAuthNavigation = async (params: {
  to: RouteLike;
  authStore: AuthStoreLike;
}) => {
  const { to, authStore } = params;

  if (!authStore.initialized) {
    await authStore.initialize();
  }

  const requiresPublic = Boolean(to.meta.public);
  if (requiresPublic) {
    if (authStore.isAuthenticated && to.path === "/login") {
      const homePath = resolveRoleHomePath(authStore.roles);
      if (homePath) {
        return homePath;
      }
    }
    return true;
  }

  if (!authStore.isAuthenticated) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  const requiredRoles = to.meta.roles ?? [];
  if (requiredRoles.length === 0) {
    return true;
  }

  const allowed = requiredRoles.some((role) => authStore.roles.includes(role));
  if (!allowed) {
    return {
      path: "/forbidden",
      query: {
        from: to.fullPath,
      },
    };
  }

  return true;
};
