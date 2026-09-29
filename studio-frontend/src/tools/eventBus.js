import Vue from "vue"

// Global event bus, shared by the classic app and the mobile app. It used
// to live in main.js; it moved here so that data modules (API, store) can
// import it without pulling the classic entry point into other bundles.
export const bus = new Vue()
