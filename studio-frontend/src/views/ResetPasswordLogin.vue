<template>
  <div class="login-centered">
    <div class="flex row single-message-error">
      {{ $tc("globalError.auth_magic_link", 1) }}
      <a href="/reset-password">{{ $tc("globalError.auth_magic_link", 2) }}</a>
    </div>
  </div>
</template>
