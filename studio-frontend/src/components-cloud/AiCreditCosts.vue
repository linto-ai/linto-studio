<template>
  <dl v-if="actions.length" class="ai-credit-costs">
    <div
      v-for="action in actions"
      :key="action.capability"
      class="ai-credit-costs__row">
      <dt class="ai-credit-costs__action">
        <PhIcon :name="action.icon" />
        <span>{{ $t(action.labelKey) }}</span>
      </dt>
      <dd class="ai-credit-costs__cost">
        {{
          $tc("billing.settings.balances.ai.cost", action.cost, {
            count: action.cost,
          })
        }}
      </dd>
    </div>
  </dl>
</template>

<script>
// The AI actions that spend credits, the order they are listed in, and how
// they read. The prices themselves come from the plan (usage costs).
const COSTED_ACTIONS = [
  {
    capability: "ai.chat",
    labelKey: "billing.settings.balances.ai.chat",
    icon: "chat-circle-text",
  },
  {
    capability: "ai.generations",
    labelKey: "billing.settings.balances.ai.generation",
    icon: "file-text",
  },
]

// What an AI action costs in credits.
export default {
  name: "AiCreditCosts",
  props: {
    // { "ai.chat": 1, "ai.generations": 3 }, from the plan
    costs: { type: Object, required: true },
  },
  computed: {
    actions() {
      return COSTED_ACTIONS.filter(
        (action) => this.costs[action.capability] > 0,
      ).map((action) => ({ ...action, cost: this.costs[action.capability] }))
    },
  },
}
</script>

<style lang="scss" scoped>
.ai-credit-costs {
  display: flex;
  flex-direction: column;
  gap: var(--tiny-gap);
  margin: 0;
  padding: var(--small-gap) var(--medium-gap);
  border-radius: var(--border-radius-sm);
  background: var(--neutral-10);
  font-size: var(--text-xs);
}

.ai-credit-costs__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--small-gap);
}

.ai-credit-costs__action {
  display: flex;
  align-items: center;
  gap: var(--tiny-gap);
}

.ai-credit-costs__cost {
  margin: 0;
  font-weight: 700;
  white-space: nowrap;
}
</style>
