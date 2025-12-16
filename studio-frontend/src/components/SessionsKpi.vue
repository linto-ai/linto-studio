<template>
  <div>
    <GenericTableRequest
      ref="table"
      idKey="sessionId"
      :fetchMethod="fetchMethod"
      :columns="columns"
      :initSortListDirection="sortListDirection"
      :initSortListKey="sortListKey" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import { getSessionListKpi } from "@/api/kpi"
import { timeToHMS } from "@/tools/timeToHMS"
import { userName } from "@/tools/userName"
export default {
  props: {
    organizationId: {
      type: String,
      required: false,
    },
    organization: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      columns: [
        {
          key: "firstConnectionAt",
          label: "Date",
          width: "auto",
          transformValue: (value) =>
            value ? new Date(value).toLocaleDateString() : null,
        },
        {
          key: "session.name",
          label: this.$t("session_kpi.name_label"),
          width: "auto",
          transformValue: this.computeSessionName,
        },
        // {
        //   key: "userCount.total",
        //   label: "Utilisateurs",
        //   width: "auto",
        //   mainLabel: "Total",
        // },
        // {
        //   key: "watchTime.average",
        //   label: "Temps moyen",
        //   width: "auto",
        //   transformValue: timeToHMS,
        //   mainLabel: "Total",
        // },
        // {
        //   key: "watchTime.total",
        //   label: "Somme",
        //   width: "auto",
        //   transformValue: timeToHMS,
        //   mainLabel: "Total",
        // },
        {
          key: "userCount.above5Min",
          label: this.$t("session_kpi.viewer_label"),
          width: "auto",
          //mainLabel: "> 5 min",
          transformValue: (value) => (value == 0 ? null : value),
        },
        {
          key: "watchTime.avgAbove5Min",
          label: this.$t("session_kpi.watch_time_average_label"),
          width: "auto",
          transformValue: timeToHMS,
          //mainLabel: "> 5 min",
        },
        {
          key: "userCount.below5Min",
          label: this.$t("session_kpi.bounce_rate_label"),
          width: "auto",
          //mainLabel: "Taux de rebond (< 5 minutes)",
        },
        // {
        //   key: "watchTime.avgUnder5Min",
        //   label: "Temps moyen",
        //   width: "auto",
        //   transformValue: timeToHMS,
        //   mainLabel: "< 5 min",
        // },
      ],
      sortListDirection: "desc",
      sortListKey: "firstConnectionAt",
      indexedUsers: this?.organization?.users
        ? this.organization.users.reduce((acc, user) => {
            acc[user._id] = user
            return acc
          }, {})
        : [],
    }
  },
  mounted() {},
  methods: {
    // fetchMethod: getSessionListKpi,
    async fetchMethod(page, parameters) {
      return await getSessionListKpi(page, {
        ...parameters,
        organizationId: this.organizationId,
      })
    },
    computeSessionName(name) {
      if (name.startsWith("@")) {
        const userId = name.slice(1)
        const user = this.findUser(userId)
        return user
          ? this.$t("session_kpi.quick_session_name", {
              userName: userName(user),
            })
          : this.$t("session_kpi.quick_session_name_anonymous")
      }

      return name
    },
    findUser(id) {
      if (this.indexedUsers[id]) {
        return this.indexedUsers[id]
      }

      return null
    },
  },
  components: {
    GenericTableRequest,
  },
}
</script>
