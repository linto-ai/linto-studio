<template>
  <nav
    class="breadcrumb"
    v-if="breadcrumbItems.length > 1"
    aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="`${item.name}-${index}`"
        class="breadcrumb-item"
        :class="{ 'is-active': index === breadcrumbItems.length - 1 }">
        <router-link
          v-if="item.to && index !== breadcrumbItems.length - 1"
          :to="item.to"
          class="breadcrumb-link"
          :aria-current="index === breadcrumbItems.length - 1 ? 'page' : null">
          {{ item.label }}
        </router-link>
        <span
          v-else
          class="breadcrumb-text"
          :aria-current="index === breadcrumbItems.length - 1 ? 'page' : null">
          {{ item.label }}
        </span>
        <span
          v-if="index < breadcrumbItems.length - 1"
          class="breadcrumb-separator"
          aria-hidden="true">
          >
        </span>
      </li>
    </ol>
    <slot name="breadcrumb-actions"></slot>
  </nav>
</template>

<script>
export default {
  name: "Breadcrumb",

  data() {
    return {
      breadcrumbItems: [],
      entityCache: new Map(),
    }
  },

  computed: {
    currentOrganization() {
      return this.$store.getters["organizations/getCurrentOrganization"]
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler(newRoute) {
        this.buildBreadcrumb(newRoute)
      },
    },
  },

  methods: {
    async buildBreadcrumb(route) {
      if (!route.meta?.breadcrumb?.showInBreadcrumb) {
        this.breadcrumbItems = []
        return
      }

      try {
        const items = []
        await this.buildBreadcrumbRecursive(route, items)

        this.breadcrumbItems = items.reverse()
      } catch (error) {
        console.error("Error building breadcrumb:", error)
        this.breadcrumbItems = []
      }
    },

    async buildBreadcrumbRecursive(route, items) {
      if (!route?.meta?.breadcrumb) return

      const breadcrumbMeta = route.meta.breadcrumb

      let label = ""
      if (breadcrumbMeta.dynamic && breadcrumbMeta.entity) {
        label = await this.getDynamicLabel(route, breadcrumbMeta.entity)
      } else if (breadcrumbMeta.label) {
        label = this.$t(breadcrumbMeta.label)
      }

      if (label) {
        items.push({
          name: route.name,
          label: label,
          to: this.getRouteObject(route),
        })
      }

      if (breadcrumbMeta.parent) {
        const parentRoute = this.findRouteByName(breadcrumbMeta.parent)
        if (parentRoute) {
          await this.buildBreadcrumbRecursive(parentRoute, items)
        }
      }
    },

    async getDynamicLabel(route, entityType) {
      const entityId = this.getEntityIdFromRoute(route, entityType)
      if (!entityId) return ""

      const cacheKey = `${entityType}-${entityId}`
      if (this.entityCache.has(cacheKey)) {
        return this.entityCache.get(cacheKey)
      }

      let label = ""

      try {
        switch (entityType) {
          case "conversation":
            label = await this.getConversationName(entityId)
            break
          case "session":
            label = await this.getSessionName(entityId)
            break
          case "user":
            label = await this.getUserName(entityId)
            break
          case "organization":
            label = await this.getOrganizationName(entityId)
            break
          case "subtitle":
            label = await this.getSubtitleName(
              entityId,
              route.params.conversationId,
            )
            break
          case "transcriberProfile":
            label = await this.getTranscriberProfileName(entityId)
            break
          default:
            label = entityId // Fallback to ID
        }

        if (label) {
          this.entityCache.set(cacheKey, label)
        }
      } catch (error) {
        console.error(`Error fetching ${entityType} name:`, error)
        label = `${entityType} ${entityId}` // Fallback
      }

      return label || entityId
    },

    getEntityIdFromRoute(route, entityType) {
      const paramMap = {
        conversation: "conversationId",
        session: "sessionId",
        user: "userId",
        organization: "organizationId",
        subtitle: "subtitleId",
        transcriberProfile: "transcriberProfileId",
      }

      return route.params[paramMap[entityType]]
    },

    async getConversationName(conversationId) {
      const conversation =
        this.$store.getters["conversations/getConversationById"](conversationId)
      if (conversation?.name) {
        return conversation.name
      }

      return `Conversation ${conversationId}` // Fallback
    },

    async getSessionName(sessionId) {
      const session = this.$store.getters["sessions/getSessionById"](sessionId)
      if (session?.name) {
        return session.name
      }

      return `Session ${sessionId}`
    },

    async getUserName(userId) {
      const user = this.$store.getters["users/getUserById"](userId)
      if (user) {
        return (
          `${user.firstname || ""} ${user.lastname || ""}`.trim() || user.email
        )
      }

      return `User ${userId}`
    },

    async getOrganizationName(organizationId) {
      const organization =
        this.$store.getters["organizations/getOrganizationById"](organizationId)
      if (organization?.name) {
        return organization.name
      }

      return `Organization ${organizationId}`
    },

    async getSubtitleName(subtitleId, conversationId) {
      return `Subtitle ${subtitleId}`
    },

    async getTranscriberProfileName(profileId) {
      const profile =
        this.$store.getters["transcriberProfiles/getProfileById"](profileId)
      if (profile?.name) {
        return profile.name
      }

      return `Profile ${profileId}`
    },

    findRouteByName(routeName) {
      const routes = this.$router.options.routes
      return this.findRouteInTree(routes, routeName)
    },

    findRouteInTree(routes, routeName) {
      for (const route of routes) {
        if (route.name === routeName) {
          return route
        }
        if (route.children) {
          const found = this.findRouteInTree(route.children, routeName)
          if (found) return found
        }
      }
      return null
    },

    getRouteObject(route) {
      const routeObj = { name: route.name }

      if (route.params && Object.keys(route.params).length > 0) {
        routeObj.params = { ...route.params }
      }

      if (route.query && Object.keys(route.query).length > 0) {
        routeObj.query = { ...route.query }
      }

      return routeObj
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  height: 54px;
  padding: 0;

  li {
    margin: 0;
  }

  &-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
  }

  &-item {
    display: flex;
    align-items: center;

    &.is-active {
      .breadcrumb-text {
        font-weight: 600;
        color: var(--color-text-primary, #2c3e50);
      }
    }
  }

  &-link {
    color: var(--color-text-muted, #6c757d);
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-primary, #007bff);
      text-decoration: underline;
      background-color: var(--color-bg-hover, #f8f9fa);
    }

    &:focus {
      outline: 2px solid var(--color-primary, #007bff);
      outline-offset: 2px;
    }
  }

  &-text {
    padding: 0.25rem 0.5rem;
    color: var(--color-text-primary, #2c3e50);
  }

  &-separator {
    margin: 0 0.5rem;
    color: var(--color-text-muted, #6c757d);
    font-size: 0.875rem;
    user-select: none;
  }

  @media (max-width: 768px) {
    &-item:not(:last-child):not(:first-child) {
      display: none;
      &:nth-last-child(2) {
        display: flex;
      }
    }

    &-separator {
      margin: 0 0.25rem;
    }

    &-link,
    &-text {
      padding: 0.125rem 0.25rem;
      font-size: 0.875rem;
    }
  }

  @media (prefers-color-scheme: dark) {
    &-link {
      color: var(--color-text-muted-dark, #adb5bd);

      &:hover {
        color: var(--color-primary-dark, #66b3ff);
        background-color: var(--color-bg-hover-dark, #343a40);
      }
    }

    &-text {
      color: var(--color-text-primary-dark, #f8f9fa);
    }

    &-separator {
      color: var(--color-text-muted-dark, #adb5bd);
    }
  }
}

.breadcrumb {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
