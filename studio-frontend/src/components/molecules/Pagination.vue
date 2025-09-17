<template>
  <!-- Less than 10 pages -->
  <div class="pagination" v-if="pages < 10">
    <span class="pagination__prev" @click="previous"></span>
    <span
      v-for="pageNumber in pages"
      class="pagination-btn"
      :key="pageNumber"
      @click="goToPage(pageNumber)"
      :selected="pageNumber == value + 1">
      {{ pageNumber }}
    </span>
    <span class="pagination__next" @click="next"></span>
  </div>
  <!-- Page 4 or less -->
  <div class="pagination" v-else-if="value < 4">
    <span class="pagination__prev" @click="previous" v-if="value > 0"></span>
    <span
      v-for="pageNumber in 5"
      class="pagination-btn"
      :key="pageNumber"
      @click="goToPage(pageNumber)"
      :selected="pageNumber == value + 1">
      {{ pageNumber }}
    </span>
    <span class="pagination-gap">...</span>
    <span
      class="pagination-btn"
      @click="goToPage(pages)"
      :selected="pages == value + 1">
      {{ pages }}
    </span>
    <span class="pagination__next" @click="next"></span>
  </div>
  <!-- Page between 5 and max - 5 -->
  <div class="pagination" v-else-if="value < pages - 4">
    <span class="pagination__prev" @click="previous"></span>
    <span
      class="pagination-btn"
      @click="goToPage(1)"
      :selected="1 == value + 1">
      1
    </span>
    <span class="pagination-gap">...</span>
    <span
      v-for="pageNumber in [1, 0]"
      class="pagination-btn"
      :key="value - pageNumber"
      @click="goToPage(value - pageNumber)"
      :selected="value - pageNumber == value + 1">
      {{ value - pageNumber }}
    </span>
    <span
      v-for="pageNumber in 3"
      class="pagination-btn"
      :key="value + pageNumber"
      @click="goToPage(value + pageNumber)"
      :selected="value + pageNumber == value + 1">
      {{ value + pageNumber }}
    </span>
    <span class="pagination-gap">...</span>
    <span
      class="pagination-btn"
      @click="goToPage(pages)"
      :selected="pages == value + 1">
      {{ pages }}
    </span>
    <span class="pagination__next" @click="next"></span>
  </div>
  <!-- Page in the last 5 -->
  <div class="pagination" v-else>
    <span class="pagination__prev" @click="previous"></span>
    <span
      class="pagination-btn"
      @click="goToPage(1)"
      :selected="1 == value + 1">
      1
    </span>
    <span class="pagination-gap">...</span>
    <span
      v-for="pageNumber in 5"
      class="pagination-btn"
      :key="pageNumber"
      @click="goToPage(pages - 5 + pageNumber)"
      :selected="pages - 5 + pageNumber == value + 1">
      {{ pages - 5 + pageNumber }}
    </span>
    <span class="pagination__next" @click="next"></span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    goToPage(pageNumber) {
      this.$emit("input", pageNumber - 1)
    },
    next() {
      this.$emit(
        "input",
        this.value < this.pages - 1 ? this.value + 1 : this.value,
      )
    },
    previous() {
      this.$emit("input", this.value > 0 ? this.value - 1 : this.value)
    },
  },
}
</script>
