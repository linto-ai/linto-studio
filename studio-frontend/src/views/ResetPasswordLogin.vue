<template>
  <div class="login-centered">
    <div class="flex row single-message-error">
      {{ $tc("global_error.auth_magic_link", 1) }}
      <a href="/reset-password">{{ $tc("global_error.auth_magic_link", 2) }}</a>
    </div>
  </div>
</template>
